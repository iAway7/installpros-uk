import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      // Single source of truth for the page gutter: 24px on every breakpoint.
      // Do NOT add px-* to an element that already has `container` — it stacks
      // on top of this instead of replacing it, which is how the site ended up
      // with 48px gutters in the sections and 40px in the headers.
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      // Enforce a 16px minimum across the site: bump the sub-16 utilities so
      // text-xs / text-sm never render below 1rem.
      fontSize: {
        xs: ["1rem", { lineHeight: "1.5rem" }],
        sm: ["1rem", { lineHeight: "1.5rem" }],
      },
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          // Lighter green for dark surfaces (the hero). .theme-funnel-v2 only.
          bright: "hsl(var(--success-bright))",
        },
        // ── Tokens introduced by .theme-funnel-v2 ───────────────────────────
        // Additive: these resolve to nothing outside that scope, so the
        // Phase-1 (`:root`), admin and v1 funnel themes are untouched.
        brand: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--brand-hover))",
          icon: "hsl(var(--brand-icon))",
          soft: "hsl(var(--brand-soft))",
          deep: "hsl(var(--brand-deep))",
        },
        selection: {
          DEFAULT: "hsl(var(--selection))",
          border: "hsl(var(--selection-border))",
        },
        field: {
          DEFAULT: "hsl(var(--field))",
          hover: "hsl(var(--field-hover))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        gold: "hsl(var(--gold))",
        whatsapp: "hsl(var(--whatsapp))",
      },
      transitionTimingFunction: {
        // Design-system easing — cubic-bezier(0.16, 1, 0.3, 1)
        ds: "var(--ease-out)",
      },
      transitionDuration: {
        // DS durations: card hover 450ms, accordion 550ms, nav 400ms
        450: "450ms",
        550: "550ms",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
