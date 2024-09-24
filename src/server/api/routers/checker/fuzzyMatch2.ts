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
  const windowSize = Math.max(query.length * 2, 100); // Adjust 100 as needed for larger buffers

  // Calculate the start and end indices of the search window
  const startIndex = Math.max(0, expectedIndex - windowSize);
  const endIndex = Math.min(doc.length, expectedIndex + windowSize);

  // Extract the search window from the document
  const windowSubstring = doc.substring(startIndex, endIndex);

  // Initialize the SequenceMatcher with the query and the window substring
  const sequenceMatcher = new difflib.SequenceMatcher(
    null,
    query,
    windowSubstring,
  );

  // Find the matching blocks
  const matches = sequenceMatcher.getMatchingBlocks();

  // Variables to keep track of the best match
  let bestMatchSize = 0;
  let bestMatchIndex = 0;

  // Iterate over the matching blocks to find the best match
  for (const match of matches) {
    if (match.size > bestMatchSize) {
      bestMatchSize = match.size;
      bestMatchIndex = match.j; // Index in the window substring
    }
  }

  // Extract the best matching substring from the window substring
  const matchedSubstring = windowSubstring.substr(
    bestMatchIndex,
    bestMatchSize,
  );

  // Calculate the actual index in the document
  const actualIndex = startIndex + bestMatchIndex;

  return {
    matchedSubstring,
    actualIndex,
  };
}
