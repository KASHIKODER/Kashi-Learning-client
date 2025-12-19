import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '400px',
      'sm': '640px',
      'md': '800px', // ✅ custom breakpoint
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      fontFamily: {
        Poppins: ["var(--font-Poppins)", "sans-serif"],
        Josefin: ["var(--font-Josefin)", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // 💡 Light Mode
        lightBg: '#f9f9f9',
        lightCard: '#ffffff',
        lightText: '#111827',
        lightPrimary: '#0f766e',
        lightSecondary: '#22d3ee',
        lightError: '#dc2626',

        // 🌙 Dark Mode
        darkBg: '#0a0a0a',
        darkCard: '#111827',
        darkText: '#f3f4f6',
        darkPrimary: '#4cceac',
        darkSecondary: '#22d3ee',
        darkError: '#ef4444',
      },
      boxShadow: {
        'card-light': '0 8px 25px rgba(0,0,0,0.08)',
        'card-dark': '0 8px 25px rgba(255,255,255,0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-bg.svg')",
      },
      keyframes: {
        'floatScaleGlow': {
          '0%,100%': { transform: 'translateY(0) scale(1)', boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)' },
          '50%': { transform: 'translateY(-15px) scale(1.05)', boxShadow: '0 25px 60px rgba(255, 215, 0, 0.4)' },
        },
        'shake': {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'spin-slow': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        'ping-slow': { '0%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(1.5)', opacity: '0' } },
        'gradient-xy': { '0%,100%': { 'background-position': '0% 50%' }, '50%': { 'background-position': '100% 50%' } },
        'fadeIn': { from: { opacity: 0, transform: 'translateY(-5px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'floatScaleGlow': 'floatScaleGlow 6s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0,0,0.2,1) infinite',
        'gradient-xy': 'gradient-xy 3s ease infinite',
        'fadeIn': 'fadeIn 0.2s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
