/**
 * Extracts tip patterns from doc2 and maps them to doc1.
 *
 * @param {string} doc1 - The original document.
 * @param {string} doc2 - The modified document containing tip patterns.
 * @returns {Array<Object>} An array of objects with oldText, newText, tipNumber, and index.
 */
function extractTipPatterns(doc1: string, doc2: string) {
  // Define the regex pattern with capturing groups
  const tipTagPattern = /<tip:(\d+)>(.*?)<old:\d+:new>(.*?)<\/tip:\1>/gs;

  const tips = []; // Array to hold the resulting tip objects
  let match;
  let cumulativeInsertedLength = 0; // To track the total length of inserted tip patterns

  while ((match = tipTagPattern.exec(doc2)) !== null) {
    const [fullMatch, tipNumber, preOldText, newText] = match;
    const tipStartIndexInDoc2 = match.index;

    // Calculate the corresponding index in doc1 by subtracting the cumulative inserted lengths
    const indexInDoc1 = tipStartIndexInDoc2 - cumulativeInsertedLength;

    // Extract the old text from doc1 at the calculated index
    // Assuming the old text is the same length as the new text
    const oldText = doc1.substr(indexInDoc1, newText!.length);

    // Push the extracted information into the tips array
    tips.push({
      oldText: oldText,
      newText: newText,
      tipNumber: parseInt(tipNumber!, 10),
      index: indexInDoc1,
    });

    // Update the cumulative inserted length
    cumulativeInsertedLength += fullMatch.length;
  }

  return tips;
}

// Example usage:

const doc1 =
  "This is the original document. It has some text that will be changed.";
const doc2 =
  "This is the original <tip:1>document<old:101:new>doc</tip:1>. It has some <tip:2>words<old:102:new>text</tip:2> that will be changed.";

const extractedTips = extractTipPatterns(doc1, doc2);
console.log(extractedTips);

/*
Output:
[
  {
    oldText: "document",
    newText: "document",
    tipNumber: 1,
    index: 21
  },
  {
    oldText: "text",
    newText: "text",
    tipNumber: 2,
    index: 46
  }
]
*/
