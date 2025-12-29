import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#34A853",
          dark: "#2E8B46",
          light: "#dcfce7",
        },
        "background-light": "#f8f9fa",
        "background-dark": "#101214",
        "surface-light": "#ffffff",
        "surface-dark": "#1c1e21",
        "text-main": "#212529",
        "text-secondary": "#6c757d",
        "text-muted": "#525252",
        "border-color": "#e2e8f0",
        "border-light": "#e9ecef",
        "border-dark": "#2d3035",
        "primary-hover": "#0fd60f",
        "accent-good": "#34A853",
        "accent-warning": "#FBBC04",
        "accent-danger": "#EA4335",
        background: "#f8faf8",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      fontFamily: {
        display: ["Outfit", "Noto Sans Thai", "sans-serif"],
        body: ["Noto Sans Thai", "sans-serif"],
        sans: ['Noto Sans Thai', 'Google Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1.5rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

