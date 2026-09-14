import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

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
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      colors: {
        // ── Canvas ──
        "bg-base": "#0A0A0B",
        "bg-surface": "#121214",
        "bg-surface-raised": "#18181B",
        "bg-surface-hover": "#1E1E21",
        "bg-surface-pressed": "#232326",
        "bg-input": "#17171A",
        // ── Borders ──
        "border-subtle": "#232326",
        "border-default": "#2C2C30",
        "border-strong": "#3A3A3F",
        // ── Accent ──
        accent: "#C3ED00",
        "accent-hover": "#D4FF1A",
        "accent-pressed": "#A8CC00",
        // ── Text ──
        "text-primary": "#FAFAFA",
        "text-secondary": "#A1A1A6",
        "text-muted": "#6E6E73",
        "text-on-accent": "#0A0A0B",
        // ── Status ──
        "status-new": "#C3ED00",
        "status-info": "#5B9DF9",
        "status-success": "#34D399",
        "status-warning": "#FBBF24",
        "status-danger": "#F87171",
        "status-danger-hover": "#FCA5A5",
        "status-neutral": "#6E6E73",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        full: "999px",
      },
      spacing: {
        "4": "4px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
        "20": "20px",
        "24": "24px",
        "32": "32px",
        "40": "40px",
        "48": "48px",
        "64": "64px",
      },
      fontSize: {
        display:     ["28px", { lineHeight: "36px", fontWeight: "600" }],
        heading:     ["20px", { lineHeight: "28px", fontWeight: "600" }],
        subheading:  ["15px", { lineHeight: "22px", fontWeight: "600" }],
        body:        ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-medium":["14px", { lineHeight: "20px", fontWeight: "500" }],
        small:       ["13px", { lineHeight: "18px", fontWeight: "400" }],
        micro:       ["11px", { lineHeight: "14px", fontWeight: "500", letterSpacing: "0.04em" }],
      },
      boxShadow: {
        float: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px #232326",
        focus: "0 0 0 3px rgba(195,237,0,0.24)",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0"  },
        },
        "fade-in": {
          "0%":   { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)"    },
        },
      },
      animation: {
        shimmer:  "shimmer 1.5s infinite linear",
        "fade-in":"fade-in 180ms ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
