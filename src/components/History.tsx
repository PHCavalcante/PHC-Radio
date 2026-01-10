import { useState } from "react";
import { AlbumArt, SpotifyIcon } from "./icons";

export interface Song {
  id: number;
  title: string;
  artist: string;
  albumArtUrl?: string;
}

interface HistoryProps {
  songs: Song[];
  onClose: () => void;
}

export function History({ songs, onClose }: HistoryProps) {
  const [hoveredSongId, setHoveredSongId] = useState<number | null>(null);

  const handleSpotifyClick = (
    e: React.MouseEvent,
    title: string,
    artist: string
  ) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${title} ${artist}`);
    const url = `https://open.spotify.com/search/${query}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-40 flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-full bg-[#0f0f0f] text-white flex flex-col animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Histórico de Músicas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-2xl font-light"
          >
            ×
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 rounded bg-[#1a1a1a] flex items-center justify-center mb-4">
                <AlbumArt className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 text-center">
                Nenhuma música no histórico ainda.
              </p>
            </div>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded hover:bg-white/5 transition-colors cursor-pointer group relative"
                onMouseEnter={() => setHoveredSongId(song.id)}
                onMouseLeave={() => setHoveredSongId(null)}
              >
                {song.albumArtUrl ? (
                  <img
                    src={song.albumArtUrl}
                    alt={`${song.title} album art`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#1a1a1a] flex items-center justify-center shrink-0">
                    <AlbumArt className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate text-xs sm:text-sm">
                    {song.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
                {hoveredSongId === song.id && (
                  <div className="relative group/spotify shrink-0">
                    <button
                      onClick={(e) =>
                        handleSpotifyClick(e, song.title, song.artist)
                      }
                      className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
                      aria-label="Escutar no Spotify"
                    >
                      <SpotifyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954]" />
                    </button>
                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900/95 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/spotify:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      Escutar no Spotify
                      <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900/95"></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
