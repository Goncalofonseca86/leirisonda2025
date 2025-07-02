/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "baby-blue": {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#87CEFA", // Sky blue
          500: "#ADD8E6", // Light blue
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        leirisonda: {
          primary: "#87CEFA",
          secondary: "#ADD8E6",
          accent: "#007784",
          blue: "#61a5d6",
          dark: "#007784",
        },
      },
      backgroundImage: {
        "baby-blue-gradient": "linear-gradient(135deg, #87CEFA, #ADD8E6)",
        "login-hero": "linear-gradient(135deg, #87CEFA, #ADD8E6)",
      },
      fontFamily: {
        sans: ["Open Sans", "system-ui", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
