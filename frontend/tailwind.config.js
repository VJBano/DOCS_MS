/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        RobotoBlack:["RobotoBlack", "sans-serif"],
        RobotoRegular: ["RobotoRegular","sans-serif"],
        RobotoMedium: ["RobotoMedium","sans-serif"],
        RobotoLight: ["RobotoLight", "sans-serif"]
      },
    },
  },
  plugins: [],
}

