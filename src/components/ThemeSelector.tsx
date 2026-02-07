import { useState, useMemo } from "react";
import { SettingsIcon, SunIcon, MoonIcon } from "./icons";
import { useTheme } from "../contexts/ThemeContext";
import type { ColorScheme } from "../types/theme";
import { getThemeColors } from "../types/theme";

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className = "" }: ThemeSelectorProps) {
  const { theme, setColorScheme, toggleMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const colors = useMemo(
    () => getThemeColors(theme.mode, theme.colorScheme),
    [theme.mode, theme.colorScheme]
  );

  const colorSchemes: { value: ColorScheme; label: string; color: string }[] = [
    { value: "default", label: "Padrão", color: theme.mode === "dark" ? "#ffffff" : "#000000" },
    { value: "blue", label: "Azul", color: "#3b82f6" },
    { value: "purple", label: "Roxo", color: "#a855f7" },
    { value: "green", label: "Verde", color: "#10b981" },
    { value: "red", label: "Vermelho", color: "#ef4444" },
    { value: "orange", label: "Laranja", color: "#f97316" },
  ];

  return (
    <div className={`relative ${className}`} style={{ zIndex: 10000 }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg transition-colors flex items-center justify-center"
        style={{
          color: colors.text,
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.mode === "dark" 
            ? "rgba(255, 255, 255, 0.05)" 
            : "rgba(0, 0, 0, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        aria-label="Configurações de tema"
      >
        <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-transparent"
            style={{ zIndex: 9999 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed rounded-lg shadow-2xl p-4 space-y-4 animate-fadeIn"
            style={{
              backgroundColor: colors.backgroundSecondary,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              zIndex: 10000,
              top: "80px",
              right: "20px",
              width: "256px",
              maxWidth: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Modo
              </label>
              <button
                onClick={toggleMode}
                className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.backgroundTertiary,
                  color: colors.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.mode === "dark" 
                    ? "rgba(255, 255, 255, 0.05)" 
                    : "rgba(0, 0, 0, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                }}
              >
                <span className="flex items-center gap-2">
                  {theme.mode === "dark" ? (
                    <>
                      <MoonIcon className="w-5 h-5" />
                      <span>Escuro</span>
                    </>
                  ) : (
                    <>
                      <SunIcon className="w-5 h-5" />
                      <span>Claro</span>
                    </>
                  )}
                </span>
                <span className="text-xs opacity-70">
                  {theme.mode === "dark" ? "Claro" : "Escuro"}
                </span>
              </button>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Esquema de Cores
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => setColorScheme(scheme.value)}
                    className={`p-3 rounded-lg transition-all ${
                      theme.colorScheme === scheme.value
                        ? "ring-2 ring-offset-2"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor: scheme.color,
                      ...(theme.colorScheme === scheme.value && {
                        boxShadow: `0 0 0 2px ${colors.accent}, 0 0 0 4px ${colors.backgroundSecondary}`,
                      }),
                    }}
                    aria-label={scheme.label}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor:
                            theme.colorScheme === scheme.value
                              ? colors.backgroundSecondary
                              : "rgba(255, 255, 255, 0.3)",
                        }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{
                          color:
                            theme.colorScheme === scheme.value
                              ? colors.backgroundSecondary
                              : "white",
                        }}
                      >
                        {scheme.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
