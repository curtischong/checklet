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

export type Suggestion = {
    originalText: string;
    editedText: string;
    editOps: EditOp[]; // this coord will be relative to the original text. not the document
    checkId: string;
};

export class DocRange {
    constructor(public start: number, public end: number) {}

    isAdjacent(other: DocRange): boolean {
        return this.end === other.start;
    }
    merge(other: DocRange): void {
        this.end = other.end;
    }
}
