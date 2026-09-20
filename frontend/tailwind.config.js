/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8fafc',
        'surface-subtle': '#f1f5f9',
        'surface-border': '#e2e8f0',
        'surface-hover': '#e2e8f0',
        foreground: '#0f172a',
        'foreground-muted': '#64748b',
        // Safety / Danger colors
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          subtle: 'rgba(239, 68, 68, 0.15)',
          glow: 'rgba(239, 68, 68, 0.35)',
          border: 'rgba(239, 68, 68, 0.4)'
        },
        safe: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
          subtle: 'rgba(34, 197, 94, 0.15)',
          glow: 'rgba(34, 197, 94, 0.35)',
          border: 'rgba(34, 197, 94, 0.4)'
        },
        caution: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          subtle: 'rgba(245, 158, 11, 0.15)',
          glow: 'rgba(245, 158, 11, 0.35)',
          border: 'rgba(245, 158, 11, 0.4)'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 3.5s linear infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite'
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
