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
        primary: "#00afef",
        secondary: "#ef4000",
      },

      boxShadow: {
        bg: "0 0 20px 0 rgba(0, 0, 0, 0.1)",
        "bg-white": "0 0 20px 0 rgba(255, 255, 255, 0.075)",
      },

      screens: {
        mobile: {
          max: "1000px",
        },
      },

      backgroundImage: {
        main: "url('/homepage-bg.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;
