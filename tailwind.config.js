/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        surface: "#0b0f19",
        "surface-card": "rgba(15, 23, 42, 0.75)",
        "surface-border": "rgba(56, 189, 248, 0.2)",
        cyan: {
          glow: "#00f0ff",
          dim: "#0284c7"
        },
        purple: {
          glow: "#c084fc",
          nexus: "#a855f7"
        },
        emerald: {
          glow: "#10b981",
          packet: "#34d399"
        },
        rose: {
          fail: "#f43f5e",
          glow: "#fb7185"
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        display: ['"Outfit"', '"Inter"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'packet-dash': 'dash 1.5s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))' },
          '50%': { opacity: '0.4', filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.2))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
      }
    },
  },
  plugins: [],
}
