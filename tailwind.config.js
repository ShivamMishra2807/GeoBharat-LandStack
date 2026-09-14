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
        gov: {
          navy: {
            DEFAULT: '#0B2545',
            dark: '#061628',
            light: '#134074',
            surface: '#1D4E89',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
          amber: {
            DEFAULT: '#D97706',
            light: '#F59E0B',
            dark: '#B45309',
          },
          emerald: {
            DEFAULT: '#059669',
            light: '#10B981',
            dark: '#047857',
          },
          saffron: '#FF9933',
          indiaGreen: '#138808',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
