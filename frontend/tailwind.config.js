module.exports = {
    mode: "jit", // so we can compile arbitrary values: e.g. bg-[#229922]
    purge: ["./pages/**/*.tsx", "./src/**/*.tsx"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        // extend: { backgroundColor: [] },
    },
    // variants: {
    //     extend: {},
    // },
    plugins: [],
};
