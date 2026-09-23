export const TOKENS = {
  palette: {
    gray: {
      50: "oklch(0.97 0.005 275)",
      100: "oklch(0.93 0.007 275)",
      200: "oklch(0.86 0.009 275)",
      300: "oklch(0.74 0.012 275)",
      400: "oklch(0.6 0.016 275)",
      450: "oklch(0.54 0.017 275)",
      500: "oklch(0.48 0.018 275)",
      600: "oklch(0.38 0.02 275)",
      650: "oklch(0.33 0.02 275)",
      700: "oklch(0.29 0.02 275)",
      750: "oklch(0.26 0.019 275)",
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
      600: "oklch(0.5 0.19 25)",
      700: "oklch(0.44 0.17 25)",
    },
  },

  themes: {
    dark: {
      color: {
        surface: "{palette.gray.900}",
        surfaceMuted: "{palette.gray.800}",
        surfaceRaised: "{palette.gray.750}",
        surfaceHover: "{palette.gray.650}",
        text: "{palette.gray.50}",
        textOnAccent: "{palette.gray.950}",
        textMuted: "{palette.gray.300}",
        border: "{palette.gray.600}",
        borderControl: "{palette.gray.450}",
        borderHover: "{palette.gray.400}",
        borderFocus: "{palette.indigo.500}",
        accent: "{palette.indigo.500}",
        accentHover: "{palette.indigo.400}",
        danger: "{palette.red.500}",
        dangerHover: "{palette.red.400}",
        dangerText: "{palette.red.300}",
      },
      shadow: {
        popover: "0 8px 24px rgb(0 0 0 / 0.4)",
      },
    },
    light: {
      color: {
        surface: "{palette.gray.50}",
        surfaceMuted: "{palette.gray.100}",
        surfaceRaised: "{palette.gray.50}",
        surfaceHover: "{palette.gray.100}",
        text: "{palette.gray.950}",
        textOnAccent: "{palette.gray.50}",
        textMuted: "{palette.gray.500}",
        border: "{palette.gray.300}",
        borderControl: "{palette.gray.400}",
        borderHover: "{palette.gray.500}",
        borderFocus: "{palette.indigo.600}",
        accent: "{palette.indigo.600}",
        accentHover: "{palette.indigo.700}",
        danger: "{palette.red.600}",
        dangerHover: "{palette.red.700}",
        dangerText: "{palette.red.600}",
      },
      shadow: {
        popover: "0 8px 24px rgb(0 0 0 / 0.12)",
      },
    },
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "999px",
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
    move: "150ms",
  },

  easing: {
    out: "cubic-bezier(0.23, 1, 0.32, 1)",
    inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
    pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  motion: {
    scale: "0.96",
    shift: "8px",
    press: "0.97",
  },
} as const;
