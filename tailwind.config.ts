import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          soft: "var(--text-soft)",
          mute: "var(--text-mute)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          tint: "var(--primary-tint)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          tint: "var(--danger-tint)",
        },
        success: {
          DEFAULT: "var(--success)",
          tint: "var(--success-tint)",
        },
        warn: {
          DEFAULT: "var(--warn)",
          tint: "var(--warn-tint)",
        },
      },
      borderRadius: {
        card: "var(--radius)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
      },
      fontFamily: {
        sans: ["var(--font-plex)", "IBM Plex Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "980px",
      },
    },
  },
  plugins: [],
};

export default config;
