import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#77C497",
        secondary: "#cecece",
      },
      spacing: {
        web: "130px",
        mobile: "64px",
      },
      padding: {
        primary: "47px",
      },
      backgroundColor: {
        backDrop: "rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [],
};
export default config;
