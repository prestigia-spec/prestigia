import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        prestigia: {
          bg: "#070A12",
          card: "#0D1424",
          cardBorder: "#1E293B",
          primary: "#6366F1",
          primaryHover: "#4F46E5",
          purple: "#4338CA",
          alert: "#EF4444",
          gold: "#F59E0B",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
