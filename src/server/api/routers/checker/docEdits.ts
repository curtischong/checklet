import { type EditOp } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";

/*
design decisions:
- problem: the llm adds extra whitespaces or markdown text (like "**"). So the positions of the <tip> tags are not accurate
    - Why can't we just do some preprocessing to remove the extra whitespace then use edit distance?
    - becuase the edits derived from edit distance are not good. e.g. </tip:32> may be split into two edits: </t and p:32> (because there was an i that did NOT need to be edited)
    - edit distance is only the minimal edits. but to display grammarly-like suggestions, we shouldn't use the minimal edit distance
    - this is why we DIRECTLY return the EditOps array (which contains all n edits and the corresponding tips)

*/

const tipStartRegex = /<tip:(\d+)>/g;
const tipEndRegex = /<\/tip:(\d+)>/g;

// lets just handle insertions for now. we'll handle deletions later
export const getDocEdits = (
  originalDoc: string,
  editedDoc: string,
): EditOp[] => {
  // const editOps = editDistanceOperationsWithClasses(originalDoc, editedDoc);

  let match;

  // const tipStarts: Tip[] = [];
  // const tipEnds: Tip[] = [];

  // the problem is that tipStarts is NOT accurate
  const tipStarts = new Map<number, number>(); // idx -> tip number
  const tipEnds = new Map<number, number>(); // idx -> tip number
  while ((match = tipStartRegex.exec(editedDoc)) !== null) {
    tipStarts.set(match.index, parseInt(match[1]!));
  }
  while ((match = tipEndRegex.exec(editedDoc)) !== null) {
    tipEnds.set(match.index, parseInt(match[1]!));
  }

  console.log("tipStarts", tipStarts);
  console.log("tipEnds", tipEnds);

  const d1 = originalDoc;
  const d2 = editedDoc;

  const n1 = d1.length;
  const n2 = d2.length;

  let p1 = 0;
  let p2 = 0;
  const currentTipNums = []; // this is a stack
  while (p1 < n1 && p2 < n2) {
    if (d1[p1] === d2[p2]) {
      p1++;
      p2++;
      continue;
    }
    // the two docs don't match
    if (tipStarts.has(p1)) {
      // we're in a tip
      const tipNum = tipStarts.get(p1)!;
      currentTipNums.push(tipNum);
      p1++;
      continue;
    }
  }

  // we cna return tis, or just an array of editOps
  const editedDocWithOnlyEdits = "";
  return [];
};
