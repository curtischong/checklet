import localFont from "next/font/local";

// Important! if you add a new font, dont' forget to update:
// 1) The tailwind.config.js file
// 2) add the font variable in _app.tsx

export const mackinac = localFont({
    src: "../../public/fonts/P22MackinacPro-Medium_26.woff2",
    variable: "--font-mackinac",
});

export const bricolage = localFont({
    // src: "../../public/fonts/BricolageGrotesque_72pt-Light.woff2",
    src: "../../public/fonts/BricolageGrotesque-Regular.woff2",
    variable: "--font-bricolage",
});

export const basier = localFont({
    src: "../../public/fonts/BasierCircle-Regular.woff2",
    variable: "--font-basier",
});
