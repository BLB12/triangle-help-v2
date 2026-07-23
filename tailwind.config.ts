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
          50: "#F1F6F1",
          100: "#DCEADD",
          200: "#BFD4C2",
          300: "#7FA382",
          400: "#5D8863",
          500: "#3F6B44",
          600: "#2F5233",
          700: "#1F3A23",
          800: "#16291A",
          900: "#0E1B11",
        },
        accent: {
          400: "#C97552",
          500: "#A64B2A",
          600: "#7E3A20",
        },
        neutral: {
          50: "#FAFAF8",
          100: "#F2F1EA",
          200: "#E1DFD4",
          300: "#C8C6B9",
          400: "#A3A79B",
          500: "#8B8F87",
          600: "#75796F",
          700: "#565A52",
          800: "#3A3D38",
          900: "#1B231F",
          950: "#11150F",
        },
        background: "var(--background)",
        surface: "var(--card)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
