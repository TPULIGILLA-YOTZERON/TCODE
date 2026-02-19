import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1e1e1e",
        panel: "#252526",
        border: "#3e3e42",
        accent: "#0e639c",
        text: "#d4d4d4"
      }
    }
  },
  plugins: []
};

export default config;
