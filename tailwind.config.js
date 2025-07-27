/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        secondary: '#6B7280',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#8B5CF6',
        card: 'var(--color-card)',
        'active-nav-bg': 'var(--color-active-nav-bg)',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem', // ~12px
        sm: '0.875rem', // ~14px
        base: '1rem', // ~16px
        lg: '1.125rem', // ~18px
        xl: '1.25rem', // ~20px
        '2xl': '1.5rem', // ~24px
        '3xl': '1.875rem', // ~28px
        '4xl': '2.25rem', // ~36px
      },
      borderRadius: {
        'xl': '0.75rem', // 12px
        'lg': '0.5rem', // 8px
      },
      boxShadow: {
        'sm': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}