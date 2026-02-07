export type ThemeMode = "dark" | "light";
export type ColorScheme = "default" | "blue" | "purple" | "green" | "red" | "orange";

export interface Theme {
  mode: ThemeMode;
  colorScheme: ColorScheme;
}

export interface ThemeColors {
  mode: ThemeMode;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentHover: string;
  visualizer: string;
}

export const colorSchemes: Record<ColorScheme, { dark: Partial<ThemeColors>; light: Partial<ThemeColors> }> = {
  default: {
    dark: {
      accent: "#ffffff",
      accentHover: "#f0f0f0",
      visualizer: "rgba(255, 255, 255, 0.6)",
    },
    light: {
      accent: "#000000",
      accentHover: "#1a1a1a",
      visualizer: "rgba(0, 0, 0, 0.6)",
    },
  },
  blue: {
    dark: {
      accent: "#3b82f6",
      accentHover: "#2563eb",
      visualizer: "rgba(59, 130, 246, 0.6)",
    },
    light: {
      accent: "#1e40af",
      accentHover: "#1e3a8a",
      visualizer: "rgba(30, 64, 175, 0.6)",
    },
  },
  purple: {
    dark: {
      accent: "#a855f7",
      accentHover: "#9333ea",
      visualizer: "rgba(168, 85, 247, 0.6)",
    },
    light: {
      accent: "#7c3aed",
      accentHover: "#6d28d9",
      visualizer: "rgba(124, 58, 237, 0.6)",
    },
  },
  green: {
    dark: {
      accent: "#10b981",
      accentHover: "#059669",
      visualizer: "rgba(16, 185, 129, 0.6)",
    },
    light: {
      accent: "#047857",
      accentHover: "#065f46",
      visualizer: "rgba(4, 120, 87, 0.6)",
    },
  },
  red: {
    dark: {
      accent: "#ef4444",
      accentHover: "#dc2626",
      visualizer: "rgba(239, 68, 68, 0.6)",
    },
    light: {
      accent: "#b91c1c",
      accentHover: "#991b1b",
      visualizer: "rgba(185, 28, 28, 0.6)",
    },
  },
  orange: {
    dark: {
      accent: "#f97316",
      accentHover: "#ea580c",
      visualizer: "rgba(249, 115, 22, 0.6)",
    },
    light: {
      accent: "#c2410c",
      accentHover: "#9a3412",
      visualizer: "rgba(194, 65, 12, 0.6)",
    },
  },
};

export const getThemeColors = (mode: ThemeMode, colorScheme: ColorScheme): ThemeColors => {
  const baseColors = mode === "dark" 
    ? {
        mode,
        background: "#0a0a0a",
        backgroundSecondary: "#0f0f0f",
        backgroundTertiary: "#1a1a1a",
        text: "#ffffff",
        textSecondary: "#9ca3af",
        border: "rgba(255, 255, 255, 0.05)",
      }
    : {
        mode,
        background: "#ffffff",
        backgroundSecondary: "#f9fafb",
        backgroundTertiary: "#f3f4f6",
        text: "#111827",
        textSecondary: "#6b7280",
        border: "rgba(0, 0, 0, 0.05)",
      };

  const schemeColors = colorSchemes[colorScheme][mode];

  return {
    ...baseColors,
    ...schemeColors,
  } as ThemeColors;
};
