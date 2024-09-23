import {
  type Suggestion,
  type Tip,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { fuzzyMatch } from "@/server/api/routers/checker/fuzzyMatch";

export function extractTips(input: string): Tip[] {
  const tipReasonPairs: Tip[] = [];
  let i = 0;
  const length = input.length;

  while (i < length) {
    const tipStart = input.indexOf("<tip>", i);
    if (tipStart === -1) break; // No more tips found
    const tipEnd = input.indexOf("</tip>", tipStart);
    const tip = input.slice(tipStart + 5, tipEnd);

    const reasonStart = input.indexOf("<reason>", tipEnd);
    const reasonEnd = input.indexOf("</reason>", reasonStart);
    const reason = input.slice(reasonStart + 8, reasonEnd);

    tipReasonPairs.push({ desc: tip, reason });

    // Move index forward to continue searching
    i = reasonEnd + 9;
  }

  return tipReasonPairs;
}

const getDoc1Substring = (doc1: string, index: number, oldText: string) => {
  return doc1.substring(index, index + oldText.length);
};

// TODO: we need to wiggle a bit. offer a tollerance of += 1 for the window
// this is because the model may put invalid chars inside the <tip> tags
const offsetOfOldTextInDoc1 = (
  doc1: string,
  indexInDoc1: number,
  oldText: string,
) => {
  const calculatedOldText = getDoc1Substring(doc1, indexInDoc1, oldText);
  if (calculatedOldText === oldText) {
    console.log("used indexInDoc1");
    return 0;
  }
  const calculatedOldTextPlus1 = getDoc1Substring(
    doc1,
    indexInDoc1 + 1,
    oldText,
  );
  if (calculatedOldTextPlus1 === oldText) {
    console.log("used indexInDoc1 + 1");
    return 1;
  }
  const calculatedOldTextSub1 = getDoc1Substring(
    doc1,
    indexInDoc1 - 1,
    oldText,
  );
  if (calculatedOldTextSub1 === oldText) {
    console.log("used indexInDoc1 - 1");
    return -1;
  }
  throw new Error(
    `Old text mismatch at index ${indexInDoc1}: expected "${oldText}", found "${calculatedOldText}"`,
  );
};

// https://chatgpt.com/share/66f0c180-e6a0-800e-a55a-99862d193b2f
export function extractSuggestions(doc1: string, doc2: string): Suggestion[] {
  // Define the regex pattern with capturing groups:
  // <tip:number>oldText<old:id:new>newText</tip:number>
  const tipTagPattern =
    /<tip\|([^|]+)\|([^>]+)><old>([^<]+)<\/old><new>([^<]+)<\/new><\/tip>/g;

  const suggestions: Suggestion[] = []; // Array to hold the resulting tip objects
  let match;
  let cumulativeInsertedLength = 0; // To track the total length of inserted tip patterns

  while ((match = tipTagPattern.exec(doc2)) !== null) {
    const [fullMatch, tipName, reason, rawOldText, newText] = match;
    const tipStartIndexInDoc2 = match.index;

    // Calculate the corresponding index in doc1 by subtracting the cumulative inserted lengths
    const indexInDoc1 = tipStartIndexInDoc2 - cumulativeInsertedLength;

    // Verify that the oldText at indexInDoc1 in doc1 matches the expected oldText
    const oldText = rawOldText ?? "";

    // const offset = offsetOfOldTextInDoc1(doc1, indexInDoc1, oldText);
    // const realIndexInDoc1 = offset + indexInDoc1;

    const { matchingSubstring, actualIndex } = fuzzyMatch(
      doc1,
      oldText,
      indexInDoc1,
    );

    const realIndexInDoc1 = actualIndex;

    // Push the extracted information into the tips array
    suggestions.push({
      tipName,
      reason,
      oldText: matchingSubstring,
      newText: newText,
      range: {
        start: realIndexInDoc1,
        end: realIndexInDoc1 + matchingSubstring.length,
      },
    });

    // Update the cumulative inserted length
    // This accounts for the extra characters added by the tip pattern
    cumulativeInsertedLength += fullMatch.length - matchingSubstring.length;
  }

  return suggestions;
}
