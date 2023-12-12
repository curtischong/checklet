import { RefObject } from "react";

export type SuggestionIdToRef = {
    [key: string]: RefObject<HTMLSpanElement>;
};
