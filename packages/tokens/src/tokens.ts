export const TOKENS = {
  palette: {
    gray: {
      100: "oklch(0.98 0.003 240)",
      200: "oklch(0.95 0.006 240)",
      300: "oklch(0.92 0.009 240)",
      400: "oklch(0.85 0.015 245)",
      500: "oklch(0.71 0.025 245)",
      700: "oklch(0.45 0.025 250)",
      900: "oklch(0.25 0.02 250)",
    },
    red: {
      100: "oklch(0.97 0.013 20)",
      200: "oklch(0.91 0.045 20)",
      300: "oklch(0.83 0.085 20)",
      400: "oklch(0.74 0.13 22)",
      500: "oklch(0.67 0.16 25)",
      700: "oklch(0.5 0.15 25)",
    },
    blue: {
      100: "oklch(0.96 0.02 230)",
      200: "oklch(0.90 0.05 230)",
      300: "oklch(0.82 0.09 235)",
      400: "oklch(0.73 0.12 240)",
      500: "oklch(0.65 0.14 245)",
      700: "oklch(0.48 0.13 250)",
    },
    white: "oklch(1 0 0)",
  },

  semantic: {
    color: {
      surface: "{palette.white}",
      surfaceMuted: "{palette.gray.100}",
      text: "{palette.gray.900}",
      textMuted: "{palette.gray.700}",
      border: "{palette.gray.300}",
      borderFocus: "{palette.blue.500}",
      accent: "{palette.blue.500}",
      accentHover: "{palette.blue.700}",
      danger: "{palette.red.500}",
      dangerText: "{palette.red.700}",
    },
  },

  fontSize: {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
  },

  radius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },

  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
  },
} as const;
