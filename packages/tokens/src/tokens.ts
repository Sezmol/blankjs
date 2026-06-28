export const TOKENS = {
  palette: {
    gray: {
      50: "oklch(0.97 0.005 275)",
      100: "oklch(0.93 0.007 275)",
      200: "oklch(0.86 0.009 275)",
      300: "oklch(0.74 0.012 275)",
      400: "oklch(0.6 0.016 275)",
      500: "oklch(0.48 0.018 275)",
      600: "oklch(0.38 0.02 275)",
      700: "oklch(0.29 0.02 275)",
      800: "oklch(0.22 0.018 275)",
      900: "oklch(0.16 0.016 275)",
      950: "oklch(0.12 0.014 275)",
    },
    indigo: {
      300: "oklch(0.78 0.11 275)",
      400: "oklch(0.7 0.15 275)",
      500: "oklch(0.62 0.19 275)",
      600: "oklch(0.55 0.2 275)",
      700: "oklch(0.46 0.18 276)",
    },
    red: {
      300: "oklch(0.78 0.1 22)",
      400: "oklch(0.68 0.16 24)",
      500: "oklch(0.6 0.19 25)",
    },
  },

  semantic: {
    color: {
      surface: "{palette.gray.900}",
      surfaceMuted: "{palette.gray.800}",
      surfaceRaised: "{palette.gray.800}",
      surfaceHover: "{palette.gray.700}",
      text: "{palette.gray.50}",
      textMuted: "{palette.gray.400}",
      border: "{palette.gray.600}",
      borderHover: "{palette.gray.500}",
      borderFocus: "{palette.indigo.500}",
      accent: "{palette.indigo.500}",
      accentHover: "{palette.indigo.400}",
      accentText: "{palette.gray.50}",
      danger: "{palette.red.500}",
      dangerText: "{palette.red.300}",
    },
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },

  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
  },

  fontSize: {
    sm: "0.875rem",
    md: "0.9375rem",
    lg: "1.0625rem",
  },

  duration: {
    fast: "120ms",
    base: "180ms",
  },
} as const;
