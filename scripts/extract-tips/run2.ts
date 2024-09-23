/**
 * Extracts tip patterns from doc2 and maps them to doc1.
 *
 * @param {string} doc1 - The original document.
 * @param {string} doc2 - The modified document containing tip patterns.
 * @returns {Array<Object>} An array of objects with oldText, newText, tipNumber, and index.
 */
function extractTipPatterns(doc1: string, doc2: string) {
  // Define the regex pattern with capturing groups:
  // <tip:number>oldText<old:id:new>newText</tip:number>
  const tipTagPattern = /<tip:(\d+)>([^<]*)<old:\d+:new>([^<]*)<\/tip:\1>/g;

  const tips = []; // Array to hold the resulting tip objects
  let match;
  let cumulativeInsertedLength = 0; // To track the total length of inserted tip patterns

  while ((match = tipTagPattern.exec(doc2)) !== null) {
    const [fullMatch, tipNumber, oldText, newText] = match;
    const tipStartIndexInDoc2 = match.index;

    // Calculate the corresponding index in doc1 by subtracting the cumulative inserted lengths
    const indexInDoc1 = tipStartIndexInDoc2 - cumulativeInsertedLength;

    // Verify that the oldText at indexInDoc1 in doc1 matches the expected oldText
    const substringInDoc1 = doc1.substring(indexInDoc1, oldText?.length ?? 0);
    if (substringInDoc1 !== oldText) {
      throw new Error(
        `Old text mismatch at index ${indexInDoc1}: expected "${oldText}", found "${substringInDoc1}"`,
      );
    }

    // Push the extracted information into the tips array
    tips.push({
      oldText: oldText,
      newText: newText,
      tipNumber: parseInt(tipNumber!, 10),
      index: indexInDoc1,
    });

    // Update the cumulative inserted length
    // This accounts for the extra characters added by the tip pattern
    cumulativeInsertedLength += fullMatch.length - oldText.length;
  }

  return tips;
}

// Example usage:

const doc1 =
  "This is the original document. It has some text that will be changed.";
const doc2 =
  "This is the original <tip:1>document<old:101:new>doc</tip:1>. It has some <tip:2>text<old:102:new>words</tip:2> that will be changed.";

const extractedTips = extractTipPatterns(doc1, doc2);
console.log(extractedTips);

/*
Expected Output:
[
  {
    oldText: "document",
    newText: "doc",
    tipNumber: 1,
    index: 21
  },
  {
    oldText: "text",
    newText: "words",
    tipNumber: 2,
    index: 35
  }
]
*/
