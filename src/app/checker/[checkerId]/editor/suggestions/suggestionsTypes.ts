import { cyrb53 } from "@/utils/strings";
import { type RefObject } from "react";

export type SuggestionIdToRef = Record<string, RefObject<HTMLSpanElement>>;

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

export type SuggestionId = string;

export interface Tip {
  desc: string;
  reason: string;
}
export interface FeedbackResponse {
  tips: Tip[];
  suggestions: Suggestion[];
}

export interface Suggestion {
  tipName: string;
  reason: string;
  oldText: string;
  newText?: string;
  range: DocRange; // range of the original text
  suggestionId: SuggestionId;
}

export enum CheckType {
  highlight = "Highlight",
  rephrase = "Rephrase",
  // TODO: global check types? but I think those would just be a diff Suggestion in general
}

export type CheckDesc = {
  name: string; // this is the name of the heuristic/tip/trick
  reason: string;
  checkType: CheckType;
  //   heuristicCategory????
};

export enum SidePanelPageEnum {
  Thoughts = "Thoughts",
  Tips = "Tips",
}

export enum CheckerState {
  Default = "Default",
  Thinking = "Thinking",
  Improving = "Improving",
}

// this is not a class because when it's serialized to JSON, we can easily deseralize it (and use all the helpful functions below)
export type DocRange = {
  start: number;
  end: number;
};

export const newDocRange = (start: number, end: number): DocRange => {
  return { start, end };
};

export const isAdjacent = (r1: DocRange, r2: DocRange): boolean => {
  return r1.end === r2.start;
};

export const merge = (r1: DocRange, r2: DocRange): void => {
  r1.end = r2.end;
};

export const isBefore = (r1: DocRange, r2: DocRange): boolean => {
  return r1.end <= r2.start;
};

export const shift = (r: DocRange, amount: number): DocRange => {
  return newDocRange(r.start + amount, r.end + amount);
};

export const isIntersecting = (r1: DocRange, r2: DocRange): boolean => {
  return r1.start < r2.end && r1.end > r2.start;
};

export const isWithinRange = (smaller: DocRange, larger: DocRange): boolean => {
  return smaller.start >= larger.start && smaller.end <= larger.end;
};

export const hashSuggestion = (suggestion: Suggestion) => {
  return cyrb53(`${suggestion.oldText}old:new${suggestion.newText}`);
};
