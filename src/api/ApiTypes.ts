// export type FeedbackResponse = {
//     feedback: Suggestion[];
// };

export type EditOp = {
    range: DocRange;
    newString: string;
};

export const newEditOp = (range: DocRange, newString: string): EditOp => {
    return { range, newString };
};

export type SuggestionId = string;

export type Suggestion = {
    range: DocRange; // range of the original text
    originalText: string;
    editedText: string[];
    editOps: EditOp[]; // NOTE: these are relative to suggestion.range
    checkId: string;
    suggestionId: SuggestionId;
};

// this is not a class because when it's serialized to JSON, we can easily deseralize it (and use all the helpful functions below)
export type DocRange = {
    start: number;
    end: number;
};

export const newDocRange = (start: number, end: number): DocRange => {
    return { start, end };
};

export const isAdjacent = (r1: DocRange, r2: DocRange): boolean => {
    return r1.end === r2.start;
};

export const merge = (r1: DocRange, r2: DocRange): void => {
    r1.end = r2.end;
};

export const isBefore = (r1: DocRange, r2: DocRange): boolean => {
    return r1.end <= r2.start;
};

export const shift = (r: DocRange, amount: number): DocRange => {
    return newDocRange(r.start + amount, r.end + amount);
};

export const isIntersecting = (r1: DocRange, r2: DocRange): boolean => {
    return r1.start < r2.end && r1.end > r2.start;
};

export const isWithinRange = (smaller: DocRange, larger: DocRange): boolean => {
    return smaller.start >= larger.start && smaller.end <= larger.end;
};
