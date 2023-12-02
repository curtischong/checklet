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

// export type Suggestion = {
//     id: number;
//     feedbackCategory: string;
//     feedbackType: FeedbackType;
//     srcNautObj: string;
//     replacementText: string;
//     highlightRanges: Range[];
//     highlightRangesOnSelect: Range[];
//     shortDesc: string;
//     longDesc: string;
//     srcWord: {
//         id: number;
//         text: string;
//         startChar: number;
//         endChar: number;
//     };
//     color: string;
//     cardRef: RefObject<HTMLDivElement>;
// };

export type SuggestionId = string;

export type Suggestion = {
    range: DocRange; // range of the original text
    originalText: string;
    editedText: string;
    editOps: EditOp[];
    checkId: string;
    suggestionId: SuggestionId;
};

export class DocRange {
    constructor(public start: number, public end: number) {}

    isAdjacent(other: DocRange): boolean {
        return this.end === other.start;
    }
    merge(other: DocRange): void {
        this.end = other.end;
    }
    // isIntersecting(other: DocRange): boolean {
    //     if (this.start >= other.end || this.end <= other.start) {
    //         return false;
    //     }
    //     return true;
    // }
    isBefore(other: DocRange): boolean {
        return this.end <= other.start;
    }
    shift(amount: number): DocRange {
        return new DocRange(this.start + amount, this.end + amount);
        // this.start += amount;
        // this.end += amount;
    }
}
