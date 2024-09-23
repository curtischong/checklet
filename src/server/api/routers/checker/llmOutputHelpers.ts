import {
  type Suggestion,
  type Tip,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";

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

// https://chatgpt.com/share/66f0c180-e6a0-800e-a55a-99862d193b2f
export function extractSuggestions(doc1: string, doc2: string): Suggestion[] {
  // Define the regex pattern with capturing groups:
  // <tip:number>oldText<old:id:new>newText</tip:number>
  const tipTagPattern = /<tip:(\d+)>([^<]*)<delimiter>([^<]*)<\/tip:\1>/g;

  const tips = []; // Array to hold the resulting tip objects
  let match;
  let cumulativeInsertedLength = 0; // To track the total length of inserted tip patterns

  while ((match = tipTagPattern.exec(doc2)) !== null) {
    const [fullMatch, tipNumber, oldText, newText] = match;
    const tipStartIndexInDoc2 = match.index;

    // Calculate the corresponding index in doc1 by subtracting the cumulative inserted lengths
    const indexInDoc1 = tipStartIndexInDoc2 - cumulativeInsertedLength;

    // Verify that the oldText at indexInDoc1 in doc1 matches the expected oldText
    console.log("--------");
    console.log(`${oldText}`);
    const substringInDoc1 = doc1.substring(
      indexInDoc1,
      indexInDoc1 + (oldText?.length ?? 0),
    );
    if (substringInDoc1.trim() !== oldText?.trim()) {
      throw new Error(
        `Old text mismatch at index ${indexInDoc1}: expected "${oldText}", found "${substringInDoc1}"`,
      );
    }

    // Push the extracted information into the tips array
    tips.push({
      oldText: oldText,
      newText: newText,
      tipNumber: parseInt(tipNumber!, 10),
      range: {
        start: indexInDoc1,
        end: indexInDoc1 + oldText.length,
      },
    });

    // Update the cumulative inserted length
    // This accounts for the extra characters added by the tip pattern
    cumulativeInsertedLength += fullMatch.length - oldText.length;
  }

  return tips;
}
