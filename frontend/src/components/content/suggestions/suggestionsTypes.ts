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

type Range = {
    endPos: number;
    startPos: number;
};

export type Suggestion = {
    id: string;
    feedbackCategory: string;
    feedbackType: string;
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
