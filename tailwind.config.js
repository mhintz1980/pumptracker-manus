/** @type {import(\'tailwindcss\').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "app-gradient":
          "linear-gradient(135deg, #050505 0%, #0f0f18 45%, #050505 100%)",
        "light-gradient":
          "linear-gradient(135deg, #f7f7fb 0%, #eceef7 50%, #f4f7fb 100%)",
        "grid-overlay":
          "linear-gradient(0deg, transparent 24%, rgba(94,234,212,0.08) 25%, rgba(94,234,212,0.08) 26%, transparent 27%, transparent 74%, rgba(94,234,212,0.08) 75%, rgba(94,234,212,0.08) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(94,234,212,0.08) 25%, rgba(94,234,212,0.08) 26%, transparent 27%, transparent 74%, rgba(94,234,212,0.08) 75%, rgba(94,234,212,0.08) 76%, transparent 77%)",
      },
      boxShadow: {
        glow: "0 0 25px rgba(34, 211, 238, 0.35)",
        "inner-magenta": "inset 0 0 12px rgba(236, 72, 153, 0.35)",
        "depth-card":
          "0 28px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(15,23,42,0.45)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "hover-pop": {
          "0%": { transform: "translateZ(0) scale(1)" },
          "100%": { transform: "translateZ(8px) scale(1.02)" },
        },
        "border-sweep": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "hover-pop": "hover-pop 150ms ease-out forwards",
        "border-sweep": "border-sweep 1.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
