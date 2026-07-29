import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["General Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
        pill: "9999px",
      },
      colors: {
        background: "#f2f2f4",
        foreground: "#0a0a0a",
        surface: "#ffffff",
        border: "#e8e8ec",
        muted: "#6b6b6b",
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          foreground: "#ffffff",
        },
        secondary: "#20970b",
        neutral: {
          DEFAULT: "#9c9c9c",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e8e8ec",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#9c9c9c",
          600: "#6b6b6b",
          700: "#52525b",
          800: "#3f3f46",
          900: "#0a0a0a",
        },
        status: {
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        ring: "rgba(99,102,241,0.12)",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.10), 0 1px 2px rgba(0, 0, 0, 0.06)",
        raised: "0 8px 30px rgba(0, 0, 0, 0.08)",
        glow: "0 4px 12px rgba(99, 102, 241, 0.35)",
        dialog: "0 20px 25px rgba(0, 0, 0, 0.10), 0 8px 10px rgba(0, 0, 0, 0.04)",
      },
      spacing: {
        "nav-height": "56px",
        "container-pad": "24px",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
