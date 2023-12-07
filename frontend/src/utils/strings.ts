import crypto from "crypto";

export const createShortId = (): string => {
    const possibleChars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
    let id = "";
    for (let i = 0; i < 16; i++) {
        id += possibleChars[Math.floor(Math.random() * possibleChars.length)];
    }
    return id;
};
export const isLegitShortId = (id: string): boolean => {
    return id.length === 16 && /^[a-zA-Z0-9_-]+$/.test(id);
};

export const createUniqueId = (): string => {
    return crypto.randomBytes(32).toString("hex");
};
export const isLegitUniqueId = (id: string): boolean => {
    return id.length === 64 && /^[a-f0-9]+$/.test(id);
};

export const pluralize = (word: string, count: number): string => {
    return count === 1 ? word : word + "s";
};
