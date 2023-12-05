import { CheckType } from "@components/create-checker/CheckerTypes";

type DefaultTextForCheckType = {
    [key in CheckType]: string;
};

export const defaultOriginalText: DefaultTextForCheckType = {
    [CheckType.highlight]: "FSD",
    [CheckType.rephrase]: "January",
    [CheckType.proposal]: "proposal",
};

export const defaultEditedText: DefaultTextForCheckType = {
    [CheckType.highlight]: "",
    [CheckType.rephrase]: "Jan",
    [CheckType.proposal]: "",
};

export const defaultName: DefaultTextForCheckType = {
    [CheckType.highlight]: "Unknown Acronym",
    [CheckType.rephrase]: "Shorten Month",
    [CheckType.proposal]: "Proposal",
};

export const defaultDesc: DefaultTextForCheckType = {
    [CheckType.highlight]:
        "Recruiters may not understand this acronym. Consider expanding it, removing it, or adding a definition.",
    [CheckType.rephrase]: "Shorter months create more whitespace.",
    [CheckType.proposal]: "Proposal",
};

export const defaultCategory: DefaultTextForCheckType = {
    [CheckType.highlight]: "Clarity",
    [CheckType.rephrase]: "Whitespace",
    [CheckType.proposal]: "Proposal",
};
