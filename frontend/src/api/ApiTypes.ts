import { Suggestion } from "@components";

export type FeedbackRequest = {
    doc: string;
    checkerId: string;
};

export type FeedbackResponse = {
    feedback: Suggestion[];
};

export class DocRange {
    constructor(public start: number, public end: number) {}

    isAdjacent(other: DocRange): boolean {
        return this.end === other.start || this.start === other.end;
    }
    merge(other: DocRange): void {
        this.end = other.end;
    }
}
