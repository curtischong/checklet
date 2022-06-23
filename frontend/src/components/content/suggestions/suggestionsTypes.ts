export type LengthMetric = {
    name: string;
    value: number; // time is given in seconds?
    isTime?: boolean;
};

export type SuggestionCategory = {
    categoryName: string;
    suggestions: Suggestion[];
    color: string; // could use Color library instead
};

export type Suggestion = {
    suggestionText: string;
};
