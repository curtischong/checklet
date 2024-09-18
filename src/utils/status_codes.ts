// these codes are from https://github.com/prettymuchbryce/http-status-codes/blob/master/src/status-codes.ts
export const OK = 200;
export const CREATED = 201;
export const NO_CONTENT = 204;
export const BAD_REQUEST = 400;
export const FORBIDDEN = 403;
export const INTERNAL_SERVER_ERROR = 500;

export const isSuccessful = (status: number) => status >= 200 && status < 300;
