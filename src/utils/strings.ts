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

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export const cyrb53 = (str: string, seed = 0): number => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const tinySimpleHash = (s: string): number => {
  let h = 9;
  for (let i = 0; i < s.length; ) {
    h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  }
  return h ^ (h >>> 9);
};

export const isUuid = (s: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    s,
  );
};

export const removeNonAlphanumericExceptSpaces = (input: string): string => {
  return input.replace(/[^\w\s]/g, "");
};
