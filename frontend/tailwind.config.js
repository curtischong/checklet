module.exports = {
    mode: "jit", // so we can compile arbitrary values: e.g. bg-[#229922]
    purge: ["./pages/**/*.tsx", "./src/**/*.tsx"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            backgroundColor: [],
            boxShadow: {
                around: "0px 10px 36px rgba(0, 0, 0, 0.08)",
            },
        },
    },
    // variants: {
    //     extend: {},
    // },
    plugins: [],
};
