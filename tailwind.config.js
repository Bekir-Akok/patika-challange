/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseAndScale: {
          "0%, 100%": { transform: "scale(1) rotate(30deg)", opacity: "1" },
          "50%": { transform: "scale(1.1) rotate(30deg)", opacity: "0.5" },
        },
        pulseAndScaleLeft: {
          "0%, 100%": { transform: "scale(1) rotate(30deg)", opacity: "1" },
          "50%": { transform: "scale(1.1) rotate(-30deg)", opacity: "0.5" },
        },
      },
      animation: {
        pulseAndScale: "pulseAndScale 2s infinite",
        pulseAndScaleLeft: "pulseAndScaleLeft 2s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
