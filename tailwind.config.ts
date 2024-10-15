import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: {
        around: "0px 5px 25px rgba(0, 0, 0, 0.15)",
      },
      fontFamily: {
        // sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mackinac: ["var(--font-mackinac)"],
        // bricolage: ["var(--font-bricolage)"],
        // basier: ["var(--font-basier)"],
        // nunitolight: ["var(--font-nunito-light)"],
        nunito: ["var(--font-nunito)"],
      },
      colors: {
        background: "#fff0f1",
        primary: "#ff7066",
        primary2: "#f05146",
        // primary: "#34A43E",
        // primary2: "#f05146",
        confirm: "#4DBE57",
        confirm2: "#34A43E",
      },
      keyframes: {
        open: {
          "0%": {
            opacity: "0",
            transform: "scaleY(0.2) translateY(-50%)",
          },
          "80%": {
            opacity: "1",
            transform: "scaleY(0.8) translateY(0%)",
          },
          "100%": { opacity: "1", transform: "scaleY(1)" },
        },
        close: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeOutLeft: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-20px)" },
        },
      },
      animation: {
        open: "open 0.3s linear forwards",
        close: "close 0.3s linear forwards",
        fadeInRight: "fadeInRight 0.5s ease forwards",
        fadeOutLeft: "fadeOutLeft 0.5s ease forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
