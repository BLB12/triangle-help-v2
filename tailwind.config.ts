import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    colors: {
  brand: {
    50: "#E8FFE3",
    100: "#C8FFC0",
    200: "#9DFF90",
    300: "#70FF60",
    400: "#54FF36",
    500: "#39FF14",
    600: "#2BC000",
    700: "#208F00",
    800: "#155F00",
    900: "#0B3300",
  },

  accent: {
    400: "#54FF36",
    500: "#39FF14",
    600: "#2BC000",
  },

  neutral: {
  50: "#F8FAFC",
  100: "#F1F5F9",
  200: "#E2E8F0",
  300: "#CBD5E1",
  400: "#94A3B8",
  500: "#64748B",
  600: "#475569",
  700: "#334155",
  800: "#1E293B",
  900: "#151A21",
  950: "#111418",
},
},

  background:"var(--background)",
surface:"var(--card)",
border:"var(--border)",

  card:"#27272A",

  border:"#3F3F46",

  primary:"#39FF14",

  primaryHover:"#54FF36",

  text:"#FAFAFA",

  muted:"#A1A1AA",

}
        brand: {
          50:  "#fdf6ea",
          100: "#faebce",
          200: "#f3d698",
          300: "#ecc169",
          400: "#e8a33d",
          500: "#d68f28",
          600: "#b3721c",
          700: "#8f5a17",
          800: "#6e4512",
          900: "#4a2f0c",
        },
        accent: {
          400: "#6fc3a4",
          500: "#4fae8b",
          600: "#3c8c6d",
        },
        neutral: {
          50:  "#f7f8f8",
          100: "#eceeed",
          200: "#dadedc",
          300: "#b8c0bd",
          400: "#8b9793",
          500: "#69736f",
          600: "#4d5552",
          700: "#373e3b",
          800: "#262e31",
          900: "#171d20",
          950: "#0f1416",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
        mono: ["'IBM Plex Mono'", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
     boxShadow: {
  glow: "0 0 40px rgba(57,255,20,.35)",
},
    },
  },
  plugins: [],
};
export default config;
