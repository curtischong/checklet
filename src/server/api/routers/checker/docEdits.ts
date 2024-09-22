import { type EditOp } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { editDistanceOperationsWithClasses } from "@/server/api/routers/checker/editDistance";

const tipStartRegex = /<tip:(\d+)>/g;
const tipEndRegex = /<\/tip:(\d+)>/g;

interface Tip {
  tip: number;
  idx: number;
}

export const getDocEdits = (
  originalDoc: string,
  editedDoc: string,
): EditOp[] => {
  const editOps = editDistanceOperationsWithClasses(originalDoc, editedDoc);

  let match;

  const tipStarts: Tip[] = [];
  const tipEnds: Tip[] = [];
  while ((match = tipStartRegex.exec(editedDoc)) !== null) {
    tipStarts.push({
      tip: parseInt(match[1]!),
      idx: match.index,
    });
  }
  while ((match = tipEndRegex.exec(editedDoc)) !== null) {
    console.log(`Found match: '${match[0]}' at index ${match.index}`);
    tipEnds.push({
      tip: parseInt(match[1]!),
      idx: match.index,
    });
  }

  console.log("tipStarts", tipStarts);
  console.log("tipEnds", tipEnds);

  const editedDocWithOnlyEdits = "";
  return [];
};
