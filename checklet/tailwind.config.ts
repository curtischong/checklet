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
            },
            animation: {
                open: "open 0.3s linear forwards",
                close: "close 0.3s linear forwards",
            },
        },
    },
    plugins: [],
};
export default config;
