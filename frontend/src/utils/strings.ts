import crypto from "crypto";
export const createUniqueId = (): string => {
    return crypto.randomBytes(32).toString("hex");
};
export const pluralize = (word: string, count: number): string => {
    return count === 1 ? word : word + "s";
};
