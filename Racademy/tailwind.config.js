/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        rac: "#5ddddd",
        creme: "#fff1bf",     // Zachte crème achtergrond
        hrRed: "#c91246",
      },
    },
  },
  plugins: [],
}
