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
    editedText?: string;
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
    isEnabled: boolean;
    // Note: we don't track the checkerId here because it is the checker's job to figure out which checks it has
};

export type CheckDescObj = {
    [CheckId: string]: CheckDesc;
};

export type CheckDesc = {
    name: string;
    checkType: CheckType;
    desc: string;
    category: string; // optional
    positiveExamples: PositiveCheckExample[];
    checkId: CheckId;
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
};

export interface CheckerStorefront {
    objInfo: ObjInfo;
}

export interface FeedbackResponse {
    checkDescs: CheckDescObj;
    suggestions: Suggestion[];
}
