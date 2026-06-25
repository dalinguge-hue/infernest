import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3b82f6",
          light: "#60a5fa",  
          dark: "#2563eb",
        },
        surface: {
          DEFAULT: "#0f172a",
          card: "#1e293b",
          hover: "#334155",
        },
      },
    },
  },
  plugins: [],
};
export default config;
