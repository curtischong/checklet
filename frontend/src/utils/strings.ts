import crypto from "crypto";
export const createUniqueId = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

// TODO: update this when we update IDs
export const isLegitId = (id: string): boolean => {
    return id.length === 32;
};

export const pluralize = (word: string, count: number): string => {
    return count === 1 ? word : word + "s";
};
