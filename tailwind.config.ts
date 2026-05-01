/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            50:  '#EEF4FF',
            100: '#D6E6FF',
            200: '#ADC9FF',
            300: '#7AAAFF',
            400: '#4A87F5',
            500: '#1E5FBE',
            600: '#1A52A8',
            700: '#154290',
            800: '#0F3070',
            900: '#0A1F4A',
          },
          gold: {
            50:  '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F5A623',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
        },
      },
    },
    plugins: [],
  }