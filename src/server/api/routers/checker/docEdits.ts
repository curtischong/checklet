import { type EditOp } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { editDistanceOperationsWithClasses } from "@/server/api/routers/checker/editDistance";

/*
design decisions:
- problem: the llm adds extra whitespaces or markdown text (like "**"). So the positions of the <tip> tags are not accurate
    - Why can't we just do some preprocessing to remove the extra whitespace then use edit distance?
    - becuase the edits derived from edit distance are not good. e.g. </tip:32> may be split into two edits: </t and p:32> (because there was an i that did NOT need to be edited)
    - edit distance is only the minimal edits. but to display grammarly-like suggestions, we shouldn't use the minimal edit distance
    - this is why we DIRECTLY return the EditOps array (which contains all n edits and the corresponding tips)


    we need edit distance to create editedDocWithOnlyEdits
if you build the editedDocWithOnlyEdits, the job becomes much easier. since you can TRUST the location of the tipStarts and ends


*/

const tipStartRegex = /<tip:(\d+)>/g;
const tipEndRegex = /<\/tip:(\d+)>/g;

// lets just handle insertions for now. we'll handle deletions later
export const getEditedDocWithOnlyEdits = (
  originalDoc: string,
  editedDoc: string,
): string => {
  const editOps = editDistanceOperationsWithClasses(originalDoc, editedDoc);

  let match;

  // const tipStarts: Tip[] = [];
  // const tipEnds: Tip[] = [];

  // the problem is that tipStarts is NOT accurate
  const tipStarts = new Map<number, number>(); // locationOftip -> tip number
  const tipEnds = new Map<number, number>(); // locationOfTip -> tip number
  while ((match = tipStartRegex.exec(editedDoc)) !== null) {
    tipStarts.set(match.index, parseInt(match[1]!));
  }
  while ((match = tipEndRegex.exec(editedDoc)) !== null) {
    tipEnds.set(match.index, parseInt(match[1]!));
  }

  const editStarts = new Map<number, EditOp>(); // locationOftip -> editOp
  for (const edit of editOps) {
    editStarts.set(edit.range.start, edit);
  }

  console.log("tipStarts", tipStarts);
  console.log("tipEnds", tipEnds);

  let editedDocWithOnlyEdits = "";

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
      editedDocWithOnlyEdits += d1[p1];
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

  return editedDocWithOnlyEdits;
};

// const getSuggestions = (editedDocWithOnlyEdits: string): Suggestion[] => {
//   const tipStarts = new Map<number, number>(); // locationOftip -> tip number
//   const tipEnds = new Map<number, number>(); // locationOfTip -> tip number

//   let match;
//   while ((match = tipStartRegex.exec(editedDocWithOnlyEdits)) !== null) {
//     tipStarts.set(match.index, parseInt(match[1]!));
//   }
//   while ((match = tipEndRegex.exec(editedDocWithOnlyEdits)) !== null) {
//     tipEnds.set(match.index, parseInt(match[1]!));
//   }

//   const suggestions = [];
//   const tipStack = [];
//   for (let i = 0; i < editedDocWithOnlyEdits.length; i++) {
//     if (tipStarts.has(i)) {
//       const tipNum = tipStarts.get(i)!;
//       tipStack.push({ tipNum, startIdx: i });
//     }
//     if (tipEnds.has(i)) {
//       const endTipNum = tipEnds.get(i)!;
//       const { tipNum, startIdx } = tipStack.pop()!;
//       if (tipNum != endTipNum) {
//         throw new Error("mismatched tip numbers");
//       }

//       const suggestion: Suggestion = {
//         tip: tipNum,
//         range: {
//           start: startIdx,
//           end: i,
//         },
//         suggestionId: createShortId(),
//       };
//       suggestions.push(suggestion);
//     }
//   }
//   return suggestions;
// };
