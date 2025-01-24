/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D04848',
          dark: '#B83A3A',
          light: '#D96666',
        },
        secondary: {
          DEFAULT: '#6895D2',
          dark: '#507BBC',
          light: '#84A8DC',
        },
        accent: {
          DEFAULT: '#F3B95F',
          light: '#F6CA87',
        },
        background: {
          dark: '#161A1D',
          darker: '#0D0F11',
          card: '#1E2328',
        },
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
          accent: '#FFD700',
        }
      },
      
      fontFamily: {
        sanskrit: ['Rozha One', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}