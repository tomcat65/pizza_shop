/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        philly: {
          green: {
            DEFAULT: '#004C54',
            50: '#E5EEEF',
            100: '#CCDEE0',
            200: '#99BDC1',
            300: '#669CA2',
            400: '#337B83',
            500: '#004C54',
            600: '#003D43',
            700: '#002E32',
            800: '#001F22',
            900: '#000F11',
          },
          silver: {
            DEFAULT: '#A5ACAF',
            50: '#F7F8F8',
            100: '#EFF0F1',
            200: '#DFE1E2',
            300: '#CFD2D4',
            400: '#BFC3C5',
            500: '#A5ACAF',
            600: '#848D91',
            700: '#636E73',
            800: '#424A4E',
            900: '#212529',
          },
          red: {
            DEFAULT: '#E81828',
            50: '#FCE8EA',
            100: '#F9D2D5',
            200: '#F3A5AB',
            300: '#ED7881',
            400: '#E74B57',
            500: '#E81828',
            600: '#BA1320',
            700: '#8B0E18',
            800: '#5D0A10',
            900: '#2E0508',
          },
          blue: {
            DEFAULT: '#002D72',
            50: '#E5E9F2',
            100: '#CCD3E6',
            200: '#99A7CD',
            300: '#667BB4',
            400: '#334F9B',
            500: '#002D72',
            600: '#00245B',
            700: '#001B44',
            800: '#00122D',
            900: '#000916',
          },
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 