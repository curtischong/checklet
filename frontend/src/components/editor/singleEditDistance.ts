import { DocRange, newDocRange } from "@api/ApiTypes";

export type SingleEditDistance = {
    editedRange: DocRange;
    numCharsAdded: number;
};

export const singleEditDistance = (
    s1: string,
    s2: string,
): SingleEditDistance => {
    // O(n) solution. from both sides
    let l1 = 0;
    let l2 = 0;
    let r1 = s1.length - 1;
    let r2 = s2.length - 1;

    // l1 and l2 are now on the spot it differs
    while (s1[l1] === s2[l2] && l1 < r1 && l2 < r2) {
        l1++;
        l2++;
    }

    // r1 and r2 are now on the spot it differs
    while (s1[r1] === s2[r2] && l1 < r1 && l2 < r2) {
        r1--;
        r2--;
    }

    // const original = s1.substring(l1, r1 + 1);
    // const modified = s2.substring(l2, r2 + 1);
    // console.log("old", original, "new", modified);

    // PERF: remove the + 1
    const numCharsInModified = r2 - l2 + 1;
    const numCharsInOriginal = r1 - l1 + 1;
    return {
        editedRange: newDocRange(l1, r1 + 1),
        numCharsAdded: numCharsInModified - numCharsInOriginal,
    };
};
