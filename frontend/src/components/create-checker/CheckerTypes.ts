import { Suggestion } from "@api/ApiTypes";

export type BaseObjInfo = {
    name: string;
    desc: string;
};

// this is the type AFTER the obj has been created
export type ObjInfo = BaseObjInfo & {
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

type BaseCheck = {
    checkType: CheckType;
    instruction: string;
    category: string; // optional
    positiveExamples: PositiveCheckExample[];
    // negativeExamples: NegativeCheckExample[]; // TODO
    isEnabled: boolean;
};

export type CreateCheckReq = {
    baseObjInfo: BaseObjInfo;
    checkerId: string; // the checkerId it belongs to
} & BaseCheck;

export type CheckBlueprint = {
    objInfo: ObjInfo;
} & BaseCheck;

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
