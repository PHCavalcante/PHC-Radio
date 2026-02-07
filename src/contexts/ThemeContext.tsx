import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Theme, ThemeMode, ColorScheme } from "../types/theme";

const THEME_STORAGE_KEY = "phc-radio-theme";

const defaultTheme: Theme = {
  mode: "dark",
  colorScheme: "default",
};

interface ThemeContextType {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading theme from localStorage:", error);
    }
    return defaultTheme;
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }
  }, [theme]);

  const setMode = useCallback((mode: ThemeMode) => {
    setTheme((prev) => ({ ...prev, mode }));
  }, []);

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setTheme((prev) => ({ ...prev, colorScheme }));
  }, []);

  const toggleMode = useCallback(() => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "dark" ? "light" : "dark",
    }));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setMode, setColorScheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
