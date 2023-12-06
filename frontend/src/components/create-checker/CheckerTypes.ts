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

export type CreateCheckerReq = {
    baseObjInfo: BaseObjInfo;
    checkIds: CheckId[];
    isPublic: boolean;
};

export type CheckStatus = {
    checkId: CheckId;
    isEnabled: boolean;
};

// we need a way to determine if a check is enabled or nto
export type CheckerBlueprint = {
    objInfo: ObjInfo;
    checkStatuses: CheckStatus[];
    isPublic: boolean;
};

export interface CheckerStorefront {
    id: string;
    name: string;
    desc: string;
    creatorId: string;
}

export interface FeedbackResponse {
    checkDescs: CheckDescObj;
    suggestions: Suggestion[];
}
