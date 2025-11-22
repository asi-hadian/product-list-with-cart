/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          light: "hsl(13, 31%, 94%)",
          dark:" rgba(0, 0, 0, 0.6)",
        },
      },
    },
  },
  plugins: [],
};
