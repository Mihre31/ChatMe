/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
      animation: {
        border: "border 4s linear infinite",
      },
    },
  },
  plugins: [daisyui],
};
