import {
  type Suggestion,
  type Tip,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { levenshteinDistance } from "@/server/api/routers/checker/editDistanceSimple";
import {
  editDistanceContextRadiusForExactMatch,
  matchQueryInDocument,
} from "@/server/api/routers/checker/matchQueryInDocument3";
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

// const getDoc1Substring = (doc1: string, index: number, oldText: string) => {
//   return doc1.substring(index, index + oldText.length);
// };

// TODO: we need to wiggle a bit. offer a tollerance of += 1 for the window
// this is because the model may put invalid chars inside the <tip> tags
// const offsetOfOldTextInDoc1 = (
//   doc1: string,
//   indexInDoc1: number,
//   oldText: string,
// ) => {
//   const calculatedOldText = getDoc1Substring(doc1, indexInDoc1, oldText);
//   if (calculatedOldText === oldText) {
//     console.log("used indexInDoc1");
//     return 0;
//   }
//   const calculatedOldTextPlus1 = getDoc1Substring(
//     doc1,
//     indexInDoc1 + 1,
//     oldText,
//   );
//   if (calculatedOldTextPlus1 === oldText) {
//     console.log("used indexInDoc1 + 1");
//     return 1;
//   }
//   const calculatedOldTextSub1 = getDoc1Substring(
//     doc1,
//     indexInDoc1 - 1,
//     oldText,
//   );
//   if (calculatedOldTextSub1 === oldText) {
//     console.log("used indexInDoc1 - 1");
//     return -1;
//   }
//   throw new Error(
//     `Old text mismatch at index ${indexInDoc1}: expected "${oldText}", found "${calculatedOldText}"`,
//   );
// };

// Define the regex pattern with capturing groups:
// <tip:number>oldText<old:id:new>newText</tip:number>
const tipTagPattern =
  // /<tip\|([^|]+)\|([^>]+)><old>([^<]+)<\/old><new>([^<]+)<\/new><\/tip>/g;

  // this pattern is the same. except it can match multiple spaces between the tags (sometimes the model adds extra spaces)
  // /<tip\|([^|]+)\|([^>]+)>\ *<old>([^<]+)<\/old>\ *<new>([^<]+)<\/new>\ *<\/tip>/g;

  // this pattern is the same, except we now match for generic whitespace characters between tags
  // /<tip\|([^|]+)\|([^>]+)>\s*<old>([^<]+)<\/old>\s*<new>([^<]+)<\/new>\s*<\/tip>/g;
  // /<tip>\s*<old>([^<]+)<\/old>\s*<new>([^<]+)<\/new>\s*<name>([^<]+)<\/name>\s*<reason>([^<]+)<\/reason>\s*<\/tip>/g;

  // the new tag is optional
  /<tip>\s*<old>([^<]+)<\/old>(?:\s*<new>([^<]*)<\/new>)?\s*<name>([^<]+)<\/name>\s*<reason>([^<]+)<\/reason>\s*<\/tip>/g;

const getDoc3WithoutTipTags = (doc3: string) => {
  // replace it all with the old text since this is used to help find surrounding context around matches
  return doc3.replace(tipTagPattern, "$1");
};

// https://chatgpt.com/share/66f0c180-e6a0-800e-a55a-99862d193b2f
export function extractSuggestions(doc1: string, doc2: string): Suggestion[] {
  const doc3WithoutTipTags = getDoc3WithoutTipTags(doc2);
  const suggestions: Suggestion[] = []; // Array to hold the resulting tip objects
  let match;

  const allMatches = [];
  while ((match = tipTagPattern.exec(doc2)) !== null) {
    allMatches.push(match);
  }

  let extraneousCharsFromTipTags = 0;
  let endIdxOfLastTipTag = 0;
  let endOfLastActualIndex = 0;
  // TODO: we need to add extra chars to the predIndexInDoc1 to account for extra chain of thought?
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < allMatches.length; i++) {
    const match = allMatches[i]!;
    const [fullMatch, rawOldText, newText, tipName, reason] = match;
    // console.log(`match ${i} ${rawOldText} old|new ${newText}`);
    const tipStartIndexInDoc2 = match.index;
    // NOTE: since there may be chain of thought at the start of doc2, this is a big number^
    // we need to subtract by the length of the chain of thought

    // Calculate the corresponding index in doc1 by subtracting the cumulative inserted lengths
    const predIndexInDoc1 = Math.max(
      0,
      // basically, the predected next index is the distance between the tip tags ontop of the end of the last actual index of the previous tip tag in the real doc
      endOfLastActualIndex + tipStartIndexInDoc2 - endIdxOfLastTipTag,
    );

    // Verify that the oldText at indexInDoc1 in doc1 matches the expected oldText
    const oldText = rawOldText ?? "";

    // why do we need to provide oldTextWithContext?
    // because there may be multiple exact matches in the document
    // so we use the surrounding context to find the best match (via levenshtein distance)
    // if we rely on the error between the predictedIndexInDoc1 and the actualIndexInDoc1, we may get a bad match
    const oldTextIdxInDoc3 = match.index - extraneousCharsFromTipTags;
    const oldTextWithContext = doc3WithoutTipTags.substring(
      Math.max(0, oldTextIdxInDoc3 - editDistanceContextRadiusForExactMatch),
      Math.min(
        doc3WithoutTipTags.length,
        oldTextIdxInDoc3 + editDistanceContextRadiusForExactMatch,
      ),
    );

    const { matchedSubstring, actualIndex } = matchQueryInDocument(
      doc1,
      oldText,
      oldTextWithContext,
      predIndexInDoc1,
    );

    // console.log("predIndexInDoc1", predIndexInDoc1, "actualIndex", actualIndex);
    // console.log("matchedSubstring", matchedSubstring, "oldText", oldText);

    const realIndexInDoc1 = actualIndex;

    if (isMatchedSubstringSimilarEnough(matchedSubstring, oldText)) {
      // Push the extracted information into the tips array
      suggestions.push({
        tipName: tipName ?? "",
        reason: reason ?? "",
        oldText: matchedSubstring,
        newText: newText,
        range: {
          start: realIndexInDoc1,
          end: realIndexInDoc1 + matchedSubstring.length,
        },
        suggestionId: createShortId(),
      });
    }

    endIdxOfLastTipTag = match.index + fullMatch.length;
    endOfLastActualIndex = actualIndex + matchedSubstring.length;
    extraneousCharsFromTipTags += fullMatch.length - oldText.length;
  }

  return suggestions;
}

const isMatchedSubstringSimilarEnough = (
  matchedStr: string,
  oldText: string,
) => {
  const dist = levenshteinDistance(matchedStr, oldText);
  const distThreshold = oldText.length / 2;
  return dist <= distThreshold;
};
