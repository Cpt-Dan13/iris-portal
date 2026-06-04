/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#c084fc',
        gold: '#fbbf24',
        high: '#22c55e',
        moderate: '#3b82f6',
        low: '#eab308',
        error: '#ef4444',
        'bg-dark': '#0f0f0f',
        'card-dark': '#1a1a1a',
        'border-dark': '#333333',
        'bg-light': '#f8f8f8',
        'card-light': '#ffffff',
        'border-light': '#e5e5e5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        pill: '9999px',
        modal: '24px',
      },
      boxShadow: {
        card: '0 4px 8px rgba(0,0,0,0.10)',
        modal: '0 -4px 32px rgba(0,0,0,0.30)',
      },
    },
  },
  plugins: [],
};
