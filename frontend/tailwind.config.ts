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
        clarix: {
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          "blue-light": "#EFF6FF",
          "blue-border": "#BFDBFE",
          green: "#059669",
          "green-hover": "#047857",
          "green-light": "#ECFDF5",
          "green-border": "#A7F3D0",
          amber: "#D97706",
          "amber-light": "#FFFBEB",
          "amber-border": "#FDE68A",
          rose: "#DC2626",
          "rose-light": "#FEF2F2",
          "rose-border": "#FECACA",
          bg: "#FFFFFF",
          canvas: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          text: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
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
