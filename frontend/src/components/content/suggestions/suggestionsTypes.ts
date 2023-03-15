import { ReactElement, RefObject } from "react";

export type LengthMetric = {
    name: string;
    value: number; // time is given in seconds?
    isTime?: boolean;
};

export type SuggestionMessage = {
    imageSrc: string;
    header: string;
    content: ReactElement;
};

export type SuggestionCategory = {
    categoryName?: string; // don't have categories in backend yet
    suggestions: Suggestion[];
    color: string; // could use Color library instead
};

export type SuggestionRefs = {
    [key: string]: RefObject<HTMLDivElement>;
};

type Range = {
    endPos: number;
    startPos: number;
};

export enum FeedbackType {
    SUGGESTION = "SUGGESTION",
    WARNING = "WARNING",
}

export const FeedbackTypeOrder = {
    [FeedbackType.SUGGESTION]: 0,
    [FeedbackType.WARNING]: 1,
};

export type Suggestion = {
    id: number;
    feedbackCategory: string;
    feedbackType: FeedbackType;
    srcNautObj: string;
    replacementText: string;
    highlightRanges: Range[];
    highlightRangesOnSelect: Range[];
    shortDesc: string;
    longDesc: string;
    srcWord: {
        id: number;
        text: string;
        startChar: number;
        endChar: number;
    };
    color: string;
    cardRef: RefObject<HTMLDivElement>;
};
