/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F0F0F0",
        card: "#FFFFFF",
        primary: "#1A1A1A",
        secondary: "#6B7280",
        border: "#E5E7EB",
        activePill: "#F3F4F6",
        vedaOrange: "#FF6B35",
        vedaRed: "#E8420A",
      },
      backgroundImage: {
        'veda-gradient': 'linear-gradient(135deg, #FF6B35, #E8420A)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        'veda': '0 1px 4px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
};
