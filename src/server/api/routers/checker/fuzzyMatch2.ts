import * as difflib from "difflib";

/**
 * Finds the best fuzzy match of a query string within a document around a specific index.
 * @param doc - The document string.
 * @param query - The query string to match.
 * @param expectedIndex - The expected index where the query should appear in the document.
 * @returns An object containing the matching substring and its actual index in the document.
 */
export function fuzzyMatchAroundIndex(
  doc: string,
  query: string,
  expectedIndex: number,
): {
  matchedSubstring: string;
  actualIndex: number;
} {
  // Define the window size based on the length of the query and an additional buffer
  // we need to have a high window size since the tip tag might be AFTER the original text
  const windowSize = Math.max(query.length * 2, 400); // Adjust as needed for larger buffers

  // Calculate the start and end indices of the search window
  const startIndex = Math.max(0, expectedIndex - windowSize);
  const endIndex = Math.min(doc.length, expectedIndex + windowSize);

  // Extract the search window from the document
  const windowSubstring = doc.substring(startIndex, endIndex);

  // Variables to keep track of the best match
  let bestRatio = 0;
  let bestMatchIndex = 0;
  let bestMatchedSubstring = "";

  // Allow for slight variations in substring length to account for insertions/deletions
  const lengthVariations = [-2, -1, 0, 1, 2]; // Adjust variations as needed

  // Sliding window approach
  for (const variation of lengthVariations) {
    const candidateLength = query.length + variation;
    if (candidateLength <= 0) continue;

    const maxOffset = windowSubstring.length - candidateLength;
    for (let offset = 0; offset <= maxOffset; offset++) {
      const candidateSubstring = windowSubstring.substr(
        offset,
        candidateLength,
      );

      // Initialize the SequenceMatcher with the query and the candidate substring
      const sequenceMatcher = new difflib.SequenceMatcher(
        null,
        query,
        candidateSubstring,
      );

      // Compute the similarity ratio
      const ratio = sequenceMatcher.ratio();

      // Update the best match if this is the highest ratio so far
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestMatchIndex = offset;
        bestMatchedSubstring = candidateSubstring;
      }
    }
  }

  // Calculate the actual index in the document
  const actualIndex = startIndex + bestMatchIndex;

  return {
    matchedSubstring: bestMatchedSubstring,
    actualIndex,
  };
}
