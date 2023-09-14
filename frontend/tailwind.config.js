/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./constants/classNames.ts",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-background": "#eee",
        "light-accent": "#f2f2f2",
        "dark-accent": "#3f3d56",
        "dark-red": "rgb(255, 69, 58)",
        "dark-blue": "rgb(10, 132, 255)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
