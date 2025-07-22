/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5F91E5",       // фон страницы
        button: "#FDFCFF",        // цвет кнопки
        buttonHover: "#2D47A2",   // цвет кнопки при наведении
        mainText: "#FDFCFF",      // цвет текста
        accent: "#11131E",        // акцент
      },
    },
  },
  plugins: [],
}
