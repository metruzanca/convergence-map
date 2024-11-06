import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
    },
  },
  daisyui: {
    themes: [
      {
        eldenRing: {
          primary: "#fed7aa",
          secondary: "#fdba74",
          accent: "#fb923c",
          neutral: "#57534e",
          "base-100": "#292524",
          info: "#9ca3af",
          success: "#4ade80",
          warning: "#f472b6",
          error: "#ff4f4f",
        },
      },
    ],
  },
  plugins: [typography, daisyui],
};
