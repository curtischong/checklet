/**
 * Capitalizes the first letter of the word passed in.
 * @param str : word
 * @returns string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string): string => {
    return str && str.charAt(0).toUpperCase() + str.slice(1);
};
