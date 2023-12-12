import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                around: "0px 10px 36px rgba(0, 0, 0, 0.08)",
            },
            fontFamily: {
                lora: ["var(--font-lora)"],
                mackinac: ["var(--font-mackinac)"],
            },
        },
    },
    plugins: [],
};
export default config;
