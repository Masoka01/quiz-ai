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
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#fe6e00",
          600: "#ff6b00",
          700: "#f97015",
          800: "#c2410c",
          900: "#9a3412",
        },
        status: {
          success: "#00c758",
          warning: "#edb200",
          danger: "#fb2c36",
          info: "#3080ff",
          "mock-bg": "#fef9c2",
          "mock-fg": "#874b00",
          "planned-bg": "#f3f4f6",
          "planned-fg": "#364153",
          "development-bg": "#dbeafe",
          "development-fg": "#1447e6",
          "integrated-bg": "#f3e8ff",
          "integrated-fg": "#8200da",
          "production-bg": "#dcfce7",
          "production-fg": "#016630",
        },
        warm: {
          50: "#fcfaf7",
          100: "#f5f0eb",
          200: "#ebe3db",
          300: "#ddd1c5",
          400: "#c9b8a8",
          500: "#b89f8b",
          600: "#a88872",
          700: "#8c6f5b",
          800: "#745b4a",
          900: "#5f4b3d",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.10), 0 1px 2px rgba(0, 0, 0, 0.06)",
        raised: "0 4px 12px rgba(0, 0, 0, 0.12)",
        dialog: "0 20px 25px rgba(0, 0, 0, 0.10), 0 8px 10px rgba(0, 0, 0, 0.04)",
      },
      spacing: {
        "shell-header": "64px",
        "shell-sidebar": "256px",
        "container-pad": "32px",
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
