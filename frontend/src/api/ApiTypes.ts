import { Suggestion } from "@components";

export type FeedbackRequest = {
    text: string;
};

export type FeedbackResponse = {
    feedback: Suggestion[];
};
