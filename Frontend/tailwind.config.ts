import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        scara: {
          black: "#000000",
          green: "#C3ED00",
          white: "#FFFFFF",
          grey: "#898988",
          "green-dim": "#8fb300",
          "olive-900": "#0d1503",
          "olive-700": "#1a2e05",
          "card-dark": "#0a0a0a",
          "border-dark": "#1f1f1f",
        },
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        sub: ["var(--font-ibm-plex-sans)", "IBM Plex Sans", "sans-serif"],
        body: ["var(--font-poppins)", "Poppins", "sans-serif"],
        display: ["var(--font-rajdhani)", "Rajdhani", "sans-serif"],
      },
      animation: {
        "marquee": "marquee 35s linear infinite",
        "marquee-fast": "marquee 20s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", filter: "drop-shadow(0 0 8px rgba(195, 237, 0, 0.4))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 20px rgba(195, 237, 0, 0.9))" },
        },
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle at center, var(--tw-gradient-stops))",
        "grid-pattern": "linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
