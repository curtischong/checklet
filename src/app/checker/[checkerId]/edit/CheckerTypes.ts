import { type AccessType } from "@prisma/client";

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

export type CheckerBlueprint = {
  objInfo: ObjInfo;
  accessType: AccessType;
  placeholder: string; // the placeholder text the user sees when they are faced with a blank editor
};

export interface CheckerStorefront {
  checkerId: string;
  creatorId: string;
  name: string;
  desc: string;
  placeholder: string;
  sampleDoc: string;
  clonedFromId: string | null;
}

// export interface FeedbackResponse {
//     suggestions: Suggestion[];
// }

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
  GPT4o = "GPT-4o",
  o1 = "o1-preview",
}
