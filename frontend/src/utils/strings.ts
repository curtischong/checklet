import crypto from "crypto";
export const getUniqueId = (): string => {
    return crypto.randomBytes(32).toString("hex");
};
