/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          50:  '#FDF8F9',
          100: '#FAF0F3',
          200: '#F2DADE',
          300: '#E8BEC6',
          400: '#D494A6',
          500: '#BC6680',
          600: '#9B3A58',
          700: '#7A1E39',
          800: '#570E24',
          900: '#360511',
          950: '#1C0209',
        },
      },
      boxShadow: {
        'warm-sm': '0 1px 4px rgba(90,20,40,0.07), 0 2px 12px rgba(90,20,40,0.05)',
        'warm':    '0 4px 20px rgba(90,20,40,0.09), 0 1px 4px rgba(90,20,40,0.05)',
        'warm-lg': '0 12px 48px rgba(90,20,40,0.13), 0 4px 16px rgba(90,20,40,0.07)',
        'warm-xl': '0 24px 80px rgba(90,20,40,0.18), 0 8px 32px rgba(90,20,40,0.09)',
      },
      animation: {
        'gradient-shift': 'gradientShift 5s ease infinite',
        'float':          'float 6s ease-in-out infinite',
        'fade-up':        'fadeUp 0.6s ease-out both',
      },
      keyframes: {
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
