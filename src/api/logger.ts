const isLoggingEnabled = process.env.NEXT_PUBLIC_IS_LOGGING_ENABLED;

// The main reason for this class is for privacy reasons.
// If you are logging something that leaks private data, use this module
const Log = {
    error: (...params: any[]) => {
        // if (isLoggingEnabled) {
        console.error(...params);
        // }
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
