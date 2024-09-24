import {
  type Suggestion,
  type Tip,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch3";
import { createShortId } from "@/utils/strings";

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
    // /<tip\|([^|]+)\|([^>]+)><old>([^<]+)<\/old><new>([^<]+)<\/new><\/tip>/g;

    // this pattern is the same. except it can match multiple spaces between the tags (sometimes the model adds extra spaces)
    /<tip\|([^|]+)\|([^>]+)>\ *<old>([^<]+)<\/old>\ *<new>([^<]+)<\/new>\ *<\/tip>/g;

  const suggestions: Suggestion[] = []; // Array to hold the resulting tip objects
  let match;
  let cumulativeInsertedLength = 0; // To track the total length of inserted tip patterns

  const allMatches = [];
  while ((match = tipTagPattern.exec(doc2)) !== null) {
    allMatches.push(match);
  }

  const sumOfAllTipTagsWithoutOldText = allMatches.reduce(
    (acc, match) => acc + match[0].length - (match[3]?.length ?? 0),
    0,
  );
  console.log("sumOfAllTipTagsWithoutOldText", sumOfAllTipTagsWithoutOldText);

  const lengthOfChainOfThought =
    doc2.length - doc1.length - sumOfAllTipTagsWithoutOldText; // doc2 added all the extra tip tags, so we need to subtract that length (since it's not included in doc1's length)

  // console.log("allMatches", allMatches);
  for (let i = 0; i < allMatches.length; i++) {
    const match = allMatches[i];
    const [fullMatch, tipName, reason, rawOldText, newText] = match;
    console.log(`match ${i} ${rawOldText} old|new ${newText}`);
    const tipStartIndexInDoc2 = match.index;
    // NOTE: since there may be chain of thought at the start of doc2, this is a big number^
    // we need to subtract by the length of the chain of thought

    // Calculate the corresponding index in doc1 by subtracting the cumulative inserted lengths
    const predIndexInDoc1 = Math.max(
      0,
      // tipStartIndexInDoc2 - lengthOfChainOfThought - cumulativeInsertedLength,
      tipStartIndexInDoc2 - cumulativeInsertedLength,
    );

    // Verify that the oldText at indexInDoc1 in doc1 matches the expected oldText
    const oldText = rawOldText ?? "";

    // const offset = offsetOfOldTextInDoc1(doc1, indexInDoc1, oldText);
    // const realIndexInDoc1 = offset + indexInDoc1;

    // console.log("tipStartIndexInDoc2", tipStartIndexInDoc2);
    // console.log("indexInDoc1", predIndexInDoc1);
    // const allowedDeviation = i === 0 ? 500 : 200; // allow a LOT of deviation for the first match (since it can be low in the document and we want to match it)
    // after the first match, we have a smaller range since we've calibrated a lot of the error present in the first match
    // const { matchingSubstring, actualIndex } = fuzzyMatch(
    //   doc1,
    //   oldText,
    //   predIndexInDoc1,
    //   allowedDeviation,
    // );
    const { matchedSubstring, actualIndex } = fuzzyMatchAroundIndex(
      doc1,
      oldText,
      predIndexInDoc1,
    );
    console.log("predIndexInDoc1", predIndexInDoc1, "actualIndex", actualIndex);
    // console.log("matchedSubstring", matchedSubstring, "oldText", oldText);

    const realIndexInDoc1 = actualIndex;

    // Push the extracted information into the tips array
    suggestions.push({
      tipName: tipName ?? "",
      reason: reason ?? "",
      oldText: matchedSubstring,
      newText: newText ?? "",
      range: {
        start: realIndexInDoc1,
        end: realIndexInDoc1 + matchedSubstring.length,
      },
      suggestionId: createShortId(),
    });

    // Update the cumulative inserted length
    // This accounts for the extra characters added by the tip pattern
    cumulativeInsertedLength += fullMatch.length - matchedSubstring.length;
  }

  return suggestions;
}
