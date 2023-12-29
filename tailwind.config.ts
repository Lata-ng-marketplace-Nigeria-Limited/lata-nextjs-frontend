import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xxs: "300px",
      // => @media (min-width: 300px) { ... }
      xms: "320px",
      // => @media (min-width: 320px) { ... }
      xls: "380px",
      // => @media (min-width: 380px) { ... }
      xs: "480px",
      // => @media (min-width: 480px) { ... }
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "700px",
      // => @media (min-width: 768px) { ... }
      tablet: "800px",
      // => @media (min-width: 800px) { ... }
      sl: "940px",
      // => @media (min-width: 940px) { ... }
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xlg: "1180px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        primary: "#5113A1",
        grey1: "#F6F6F6",
        grey2: "#ECECEC",
        grey3: "#D5D5D5",
        grey4: "#CBCBCB", // "grey4" is the name of the color
        grey5: "#ABABAB",
        grey6: "#787878",
        grey7: "#5A5A5A",
        grey8: "#464646",
        grey9: "#292929",
        grey10: "#1E1E1E",
        grey11: "#282828",
        purp1: "#FAF8FC",
        purp2: "#F2ECF8",
        purp3: "#D6C3E9",
        purp8: "#32056C",
        danger: "#DB3030",
        warning: "#E5AE0F",
        success: "#2FBA54",

        "bleached-silk": "#F3F3F3",
        "snow-bank": "#E9E9E9",
        offwhite: "#F5F5F5",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        "autoFit": "repeat(auto-fit, minmax(171px, 1fr))",
        'smaller4': "repeat(auto-fit, minmax(161px, 1fr))",
      },
      fontFamily: {
        niramit: ["Niramit", "sans-serif"],
      }
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
export default config;
