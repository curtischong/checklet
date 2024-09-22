import { type EditOp } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";

export const getDocEdits = (
  originalDoc: string,
  editedDoc: string,
): EditOp[] => {
  const editOps = [];

  const d1 = originalDoc;
  const d2 = originalDoc;
  const n1 = d1.length;
  const n2 = d2.length;

  for (let i = 0; i < n1; i++) {
    for (let j = 0; j < n2; j++) {}
  }
  return editOps;
};
