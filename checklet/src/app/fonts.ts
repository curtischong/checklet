import localFont from "next/font/local";

// Important! if you add a new font, dont' forget geto update hte tailwind.config.js file AND add the font variable in _app.tsx
export const lora = localFont({
    src: "../../public/fonts/lora-v32-latin-regular.woff2",
    variable: "--font-lora",
});

export const mackinac = localFont({
    src: "../../public/fonts/P22MackinacPro-Medium_26.woff2",
    variable: "--font-mackinac",
});
