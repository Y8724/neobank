
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#5b6fd8",
          600: "#3d4fb8",
          700: "#2f3d94",
          800: "#242f73",
          900: "#1a2154",
          950: "#0f1433",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f2994a",
          600: "#e07b2e",
          700: "#c2621f",
        },
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(26, 33, 84, 0.08), 0 1px 3px -1px rgba(26, 33, 84, 0.06)",
        "soft-lg": "0 8px 30px -6px rgba(26, 33, 84, 0.12), 0 2px 8px -2px rgba(26, 33, 84, 0.08)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out both",
      },
    },
  },

  plugins: [],
};
