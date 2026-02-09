import { useState } from "react";
import { AlbumArt, SpotifyIcon } from "./icons";
import type { ThemeColors } from "../types/theme";

export interface Song {
  id: number;
  title: string;
  artist: string;
  albumArtUrl?: string;
  timestamp?: number;
  genre?: string;
  releaseYear?: number;
  albumName?: string;
}

interface HistoryProps {
  songs: Song[];
  onClose: () => void;
  themeColors: ThemeColors;
}

export function History({ songs, onClose, themeColors }: HistoryProps) {
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

  const formatTimestamp = (timestamp?: number): string => {
    if (!timestamp) return "";
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours} ${hours === 1 ? "hora" : "horas"}`;
    if (days === 1) return "Ontem";
    if (days < 7) return `Há ${days} dias`;
    
    const date = new Date(timestamp);
    const today = new Date();
    const isThisYear = date.getFullYear() === today.getFullYear();
    
    if (isThisYear) {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    }
    
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div
      className="fixed inset-0 flex justify-end animate-fadeIn"
      style={{
        backgroundColor: themeColors.mode === "dark" 
          ? "rgba(0, 0, 0, 0.7)" 
          : "rgba(0, 0, 0, 0.5)",
        zIndex: 10050,
      }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-full flex flex-col animate-slideInRight"
        style={{
          backgroundColor: themeColors.backgroundSecondary,
          color: themeColors.text,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="p-4 sm:p-6 border-b flex justify-between items-center"
          style={{ borderColor: themeColors.border }}
        >
          <h2
            className="text-lg sm:text-xl font-semibold"
            style={{ color: themeColors.text }}
          >
            Histórico de Músicas
          </h2>
          <button
            onClick={onClose}
            className="transition-colors w-8 h-8 rounded flex items-center justify-center text-2xl font-light"
            style={{
              color: themeColors.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = themeColors.text;
              e.currentTarget.style.backgroundColor = themeColors.mode === "dark" 
                ? "rgba(255, 255, 255, 0.05)" 
                : "rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = themeColors.textSecondary;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            ×
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div
                className="w-20 h-20 rounded flex items-center justify-center mb-4"
                style={{ backgroundColor: themeColors.backgroundTertiary }}
              >
                <AlbumArt
                  className="w-10 h-10"
                  style={{ color: themeColors.textSecondary }}
                />
              </div>
              <p
                className="text-center"
                style={{ color: themeColors.textSecondary }}
              >
                Nenhuma música no histórico ainda.
              </p>
            </div>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded transition-colors cursor-pointer group relative"
                style={{
                  backgroundColor: hoveredSongId === song.id
                    ? (themeColors.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.05)" 
                        : "rgba(0, 0, 0, 0.05)")
                    : "transparent",
                }}
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
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center shrink-0"
                    style={{ backgroundColor: themeColors.backgroundTertiary }}
                  >
                    <AlbumArt
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      style={{ color: themeColors.textSecondary }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium truncate text-xs sm:text-sm"
                    style={{ color: themeColors.text }}
                  >
                    {song.title}
                  </p>
                  <p
                    className="text-[10px] sm:text-xs truncate"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {song.artist}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {song.genre && (
                      <span
                        className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: themeColors.backgroundTertiary,
                          color: themeColors.textSecondary,
                        }}
                      >
                        {song.genre}
                      </span>
                    )}
                    {song.releaseYear && (
                      <span
                        className="text-[9px] sm:text-[10px]"
                        style={{ color: themeColors.textSecondary, opacity: 0.8 }}
                      >
                        {song.releaseYear}
                      </span>
                    )}
                    {song.timestamp && (
                      <span
                        className="text-[9px] sm:text-[10px]"
                        style={{ color: themeColors.textSecondary, opacity: 0.7 }}
                      >
                        • {formatTimestamp(song.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
                {hoveredSongId === song.id && (
                  <div className="relative group/spotify shrink-0">
                    <button
                      onClick={(e) =>
                        handleSpotifyClick(e, song.title, song.artist)
                      }
                      className="p-1.5 sm:p-2 rounded-full transition-colors flex items-center justify-center"
                      style={{
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = themeColors.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.1)" 
                          : "rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      aria-label="Escutar no Spotify"
                    >
                      <SpotifyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954]" />
                    </button>
                    <div
                      className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap backdrop-blur-sm text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/spotify:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
                      style={{
                        backgroundColor: themeColors.mode === "dark" 
                          ? "rgba(17, 24, 39, 0.95)" 
                          : "rgba(243, 244, 246, 0.95)",
                        color: themeColors.text,
                      }}
                    >
                      Escutar no Spotify
                      <div
                        className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                        style={{
                          borderLeftColor: themeColors.mode === "dark" 
                            ? "rgba(17, 24, 39, 0.95)" 
                            : "rgba(243, 244, 246, 0.95)",
                        }}
                      ></div>
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
