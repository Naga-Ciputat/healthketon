import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        attio: {
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          bg: "#FFFFFF",
          sidebar: "#FFFFFF",
          subtle: "#F9FAFB",
          muted: "#F3F4F6",
          border: "#E5E7EB",
          text: "#111827",
          secondary: "#4B5563",
          light: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
