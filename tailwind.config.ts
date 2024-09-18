import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mackinac: ["var(--font-mackinac)"],
        bricolage: ["var(--font-bricolage)"],
        basier: ["var(--font-basier)"],
        nunitolight: ["var(--font-nunito-light)"],
        nunito: ["var(--font-nunito)"],
      },
      colors: {
        primary: "#ff7066",
      },
    },
  },
  plugins: [],
} satisfies Config;
