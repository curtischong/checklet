export type LengthMetric = {
    name: string;
    value: number; // time is given in seconds?
    isTime?: boolean;
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
    category: string;
};
