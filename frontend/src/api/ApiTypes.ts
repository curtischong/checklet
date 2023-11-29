import { Suggestion } from "@components";

export type FeedbackRequest = {
    doc: string;
    checkerId: string;
};

export type FeedbackResponse = {
    feedback: Suggestion[];
};
