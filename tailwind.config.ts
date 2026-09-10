import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // or "selector" for Tailwind v4/latest
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
