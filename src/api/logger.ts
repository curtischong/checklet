const isInBrowser = typeof window !== "undefined";
const isLoggingEnabled =
    process.env.NEXT_PUBLIC_IS_LOGGING_ENABLED || isInBrowser;

// The main reason for this class is for privacy reasons.
// If you are logging something that leaks private data, use this module
const Log = {
    error: (...params: any[]) => {
        // we always want to log errors
        console.error(...params);
    },
    warn: (...params: any[]) => {
        if (isLoggingEnabled) {
            console.warn(...params);
        }
    },
    info: (...params: any[]) => {
        if (isLoggingEnabled) {
            console.info(...params);
        }
    },
};
export default Log;
