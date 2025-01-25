/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1a365d',
        'secondary': '#2d3748',
        // Ajoutez vos couleurs personnalisées ici
      },
    },
  },
  plugins: [],
}
