import { Suggestion } from "@api/ApiTypes";

export type CheckId = string;

export interface PositiveCheckExample {
    originalText: string;
    editedText: string;
}

export type CheckBlueprint = {
    name: string;
    instruction: string;
    longDesc: string;
    category: string; // optional
    positiveExamples: PositiveCheckExample[];
    // negativeExamples: NegativeCheckExample[]; // TODO
    checkId: CheckId;
};

export type CheckDesc = {
    name: string;
    longDesc: string;
    category: string; // optional
    positiveExamples: PositiveCheckExample[];
    checkId: CheckId;
};

// TODO: I think I should have a "creation Metadata object that is name, desc, creatorId, and id"
export type CheckerBlueprint = {
    name: string;
    desc: string;
    checkBlueprints: CheckBlueprint[];
    creatorId: string;
    id: string;
};

export interface CheckerStorefront {
    id: string;
    name: string;
    desc: string;
    creatorId: string;
}

export interface FeedbackResponse {
    checkDescs: CheckDesc[];
    suggestions: Suggestion[];
}
