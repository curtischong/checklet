import { Suggestion } from "@api/ApiTypes";

export type ObjInfo = {
    name: string;
    desc: string;
    creatorId: string;
    id: string;
};

export type CheckId = string;

export interface PositiveCheckExample {
    originalText: string;
    editedText: string[];
}

export enum CheckType {
    highlight = "Highlight",
    rephrase = "Rephrase",
    // rephraseMultiple = "Rephrase Multiple",
    proposal = "Proposal",
}
export const validCheckTypes = [CheckType.highlight, CheckType.rephrase];

export type CheckBlueprint = {
    objInfo: ObjInfo;
    checkType: CheckType;
    instruction: string;
    category: string; // optional
    positiveExamples: PositiveCheckExample[];
    // negativeExamples: NegativeCheckExample[]; // TODO
    // Note: we don't track the checkerId here because it is the checker's job to figure out which checks it has
};

export type CheckDescObj = {
    [CheckId: string]: CheckDesc;
};

export type CheckDesc = {
    objInfo: ObjInfo;
    checkType: CheckType;
    category: string; // optional
    positiveExamples: PositiveCheckExample[];
};

export type CheckStatus = {
    isEnabled: boolean;
};

export interface CheckStatuses {
    [checkId: CheckId]: CheckStatus;
}

export type CheckerBlueprint = {
    objInfo: ObjInfo;
    checkStatuses: CheckStatuses;
    isPublic: boolean;
    placeholder: string; // the placeholder text the user sees when they are faced with a blank editor
};

export interface CheckerStorefront {
    objInfo: ObjInfo;
    placeholder: string;
}

export interface FeedbackResponse {
    checkDescs: CheckDescObj;
    suggestions: Suggestion[];
}

// TODO-someday: find a better place to put this
export enum SubmittingState {
    NotSubmitting,
    ChangesDetected,
    Submitting,
}
export const SaveStatusText: {
    [key in SubmittingState]: string;
} = {
    [SubmittingState.ChangesDetected]: "Changes are unsaved",
    [SubmittingState.NotSubmitting]: "Changes are saved!",
    [SubmittingState.Submitting]: "Saving changes...",
};

export enum ModelType {
    GPT35 = "GPT-3.5",
    GPT4 = "GPT-4o",
}
