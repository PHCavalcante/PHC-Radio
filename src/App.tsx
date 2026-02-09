import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Player from "./components/Player";
import { History } from "./components/History";
import { ThemeSelector } from "./components/ThemeSelector";
import { ToastContainer } from "./components/Toast";
import { useToast } from "./hooks/useToast";
import type { Song } from "./components/History";
import { useTheme } from "./contexts/ThemeContext";
import { getThemeColors } from "./types/theme";
import "./index.css";

const METADATA_URL = import.meta.env.VITE_METADATA_URL || "https://api.zeno.fm/mounts/metadata/subscribe/qnozhn4xig7uv";
const DEFAULT_ALBUM_ART = "https://www.svgrepo.com/show/512532/music-1005.svg";
const ITUNES_DEBOUNCE_MS = 500;

interface Metadata {
  artist: string;
  title: string;
  albumArt: string;
}

function App() {
  const { theme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const colors = useMemo(
    () => getThemeColors(theme.mode, theme.colorScheme),
    [theme.mode, theme.colorScheme]
  );
  
  const [metadata, setMetadata] = useState<Metadata>({
    artist: "",
    title: "",
    albumArt: DEFAULT_ALBUM_ART,
  });
  const [streamTitle, setStreamTitle] = useState("");
  const [songHistory, setSongHistory] = useState<Song[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const lastProcessedTitle = useRef("");
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-bg", colors.background);
    document.documentElement.style.setProperty("--theme-text", colors.text);
    document.body.style.backgroundColor = colors.background;
  }, [colors]);

  const handleTogglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  const handleToggleHistory = useCallback(
    () => setIsHistoryOpen((prev) => !prev),
    []
  );

  const parseStreamTitle = (title: string): Metadata => {
    if (
      !title ||
      title.includes("ADVERTISEMENT") ||
      title.includes("PHC Radio")
    ) {
      return {
        artist: "PHC",
        title: "Connecting...",
        albumArt: DEFAULT_ALBUM_ART,
      };
    }
    const parts = title.split(" - ");
    const artist = parts[0]?.trim() || "PHC";
    const songName = parts.slice(1).join(" - ").trim() || title.trim();

    return { artist, title: songName, albumArt: DEFAULT_ALBUM_ART };
  };

  const fetchAlbumArt = useCallback(
    async (searchTerm: string, currentTitle: string) => {
      try {
        // Remove termos que atrapalham a busca (ex: "Official Video")
        const cleanTerm = searchTerm.replace(/\(.*\)|\[.*\]/g, "").trim();
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
          cleanTerm
        )}&entity=song&limit=1`;
        const response = await fetch(url);
        if (!response.ok) return;

        const data = await response.json();
        const track = data.results?.[0];
        const albumArt =
          track?.artworkUrl100?.replace("100x100", "600x600") ||
          DEFAULT_ALBUM_ART;

        setMetadata((prev) =>
          prev.title === currentTitle ? { ...prev, albumArt } : prev
        );
        setSongHistory((prev) =>
          prev.map((song) =>
            song.title === currentTitle &&
            (!song.albumArtUrl || song.albumArtUrl === DEFAULT_ALBUM_ART)
              ? { ...song, albumArtUrl: albumArt }
              : song
          )
        );
      } catch (error) {
        console.error("Error fetching album art:", error);
      }
    },
    []
  );

  const fetchSongDetails = useCallback(
    async (searchTerm: string, currentTitle: string, currentArtist: string) => {
      try {
        const cleanTerm = searchTerm.replace(/\(.*\)|\[.*\]/g, "").trim();
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
          cleanTerm
        )}&entity=song&limit=1`;
        const response = await fetch(url);
        if (!response.ok) return;

        const data = await response.json();
        const track = data.results?.[0];
        
        if (!track) return;

        const releaseDate = track.releaseDate 
          ? new Date(track.releaseDate).getFullYear()
          : undefined;
        const genre = track.primaryGenreName || track.genreName;

        setSongHistory((prev) =>
          prev.map((song) =>
            song.title === currentTitle && song.artist === currentArtist
              ? {
                  ...song,
                  genre: genre || song.genre,
                  releaseYear: releaseDate || song.releaseYear,
                  albumName: track.collectionName || song.albumName,
                }
              : song
          )
        );
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (!isPlaying) return;
    const eventSource = new EventSource(METADATA_URL);
    
    eventSource.onopen = () => {
      if (!hasConnectedRef.current) {
        hasConnectedRef.current = true;
        showToast("Conectado com sucesso", "success", 2000);
      }
    };

    eventSource.onerror = () => {
      showToast("Erro ao conectar com a rádio. Tentando novamente...", "error", 4000);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data?.streamTitle &&
          data.streamTitle !== lastProcessedTitle.current
        ) {
          setStreamTitle(data.streamTitle);
        }
      } catch (error) {
        console.error("Error processing metadata:", error);
        showToast("Erro ao processar informações da música", "error", 3000);
      }
    };
    return () => eventSource.close();
  }, [isPlaying, showToast]);

  useEffect(() => {
    if (!streamTitle || streamTitle === lastProcessedTitle.current) return;
    const newMetadata = parseStreamTitle(streamTitle);
    if (newMetadata.title === "Connecting...") return;

    setIsTransitioning(true);
    setTimeout(() => {
      setMetadata(newMetadata);
      lastProcessedTitle.current = streamTitle;
      setIsTransitioning(false);
    }, 200);

    setSongHistory((prev) => {
      if (
        prev.length > 0 &&
        prev[0].title === newMetadata.title &&
        prev[0].artist === newMetadata.artist
      ) {
        return prev;
      }
      const newEntry: Song = {
        id: Date.now(),
        title: newMetadata.title,
        artist: newMetadata.artist,
        albumArtUrl: DEFAULT_ALBUM_ART,
        timestamp: Date.now(),
      };
      return [newEntry, ...prev].slice(0, 20);
    });

    const timeoutId = setTimeout(() => {
      fetchAlbumArt(streamTitle, newMetadata.title);
      fetchSongDetails(streamTitle, newMetadata.title, newMetadata.artist);
    }, ITUNES_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [streamTitle, fetchAlbumArt, fetchSongDetails]);

  return (
    <main className="flex flex-col items-center min-h-screen p-3 sm:p-5 box-border gap-4 sm:gap-10 w-full relative overflow-visible">
      <div 
        className="w-full flex justify-end relative" 
        style={{ 
          zIndex: isPlayerExpanded || isHistoryOpen ? 1 : 10000,
          pointerEvents: isPlayerExpanded || isHistoryOpen ? "none" : "auto",
        }}
      >
        <ThemeSelector />
      </div>
      <h1
        className="font-lobster text-2xl sm:text-3xl font-normal m-0 text-center transition-colors"
        style={{ color: colors.text }}
      >
        PHC Radio
      </h1>
      <Player
        onToggleHistory={handleToggleHistory}
        metadata={metadata}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        themeColors={colors}
        isExpanded={isPlayerExpanded}
        onExpandedChange={setIsPlayerExpanded}
        isTransitioning={isTransitioning}
      />
      {isHistoryOpen && (
        <History songs={songHistory} onClose={handleToggleHistory} themeColors={colors} />
      )}
      <ToastContainer toasts={toasts} onClose={removeToast} themeColors={colors} />
    </main>
  );
}

export default App;
