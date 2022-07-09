import { Suggestion } from "@components/content/suggestions/suggestionsTypes";

export type FeedbackRequest = {
    text: string;
};

export type FeedbackResponse = {
    feedback: Suggestion[];
};
