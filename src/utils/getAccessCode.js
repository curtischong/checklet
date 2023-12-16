export const getAccessCode = () => {
    if (typeof window === "undefined") {
        return;
    }
    const params = new URL(window.location).searchParams;
    return params.get("accessCode");
};
