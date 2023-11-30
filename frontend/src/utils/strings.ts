import crypto from "crypto";
export const createUniqueId = (): string => {
    return crypto.randomBytes(32).toString("hex");
};
