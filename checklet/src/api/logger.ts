const isLoggingEnabled = process.env.NEXT_PUBLIC_IS_LOGGING_ENABLED;

const Log = {
    error: (...params: any[]) => {
        isLoggingEnabled && console.error(...params);
    },
    warn: (...params: any[]) => {
        isLoggingEnabled && console.warn(...params);
    },
    info: (...params: any[]) => {
        isLoggingEnabled && console.info(...params);
    },
};
export default Log;
