/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// https://chatgpt.com/share/66f43fd2-ddbc-800e-ad67-36df865ff54e

import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch3";

/**
 * Finds the best match of a query string within a document around a specific index.
 * First, it tries to find an exact match using regex within a specified window.
 * If no exact match is found, it falls back to a fuzzy matching approach.
 * @param doc - The document string.
 * @param query - The query string to match.
 * @param expectedIndex - The expected index where the query should appear in the document.
 * @returns An object containing the matching substring and its actual index in the document.
 */
export function matchQueryInDocument(
  doc: string,
  query: string,
  expectedIndex: number,
): {
  matchedSubstring: string;
  actualIndex: number;
} {
  // Define the search window from expectedIndex - 100 to expectedIndex + 300
  const startIndex = Math.max(0, expectedIndex - 700);
  const endIndex = Math.min(doc.length, expectedIndex + 700);

  const windowSubstring = doc.substring(startIndex, endIndex);

  // Escape special regex characters in the query
  const escapedQuery = escapeRegExp(query);

  // Create a regex for the exact match
  const regex = new RegExp(escapedQuery, "g");

  // Find all matches in the window substring
  const matches: Array<{
    matchedSubstring: string;
    actualIndex: number;
    penalty: number;
  }> = [];
  let match;
  while ((match = regex.exec(windowSubstring)) !== null) {
    const matchIndexInDoc = startIndex + match.index;
    const distance = matchIndexInDoc - expectedIndex;

    // Apply penalty: double the distance if the match is earlier than expected
    const penalty = distance < 0 ? Math.abs(distance) * 2 : distance;

    matches.push({
      matchedSubstring: match[0],
      actualIndex: matchIndexInDoc,
      penalty,
    });
  }

  if (matches.length > 0) {
    // Sort matches by penalty (lower penalty is better)
    matches.sort((a, b) => a.penalty - b.penalty);

    const bestMatch = matches[0]!;
    return {
      matchedSubstring: bestMatch.matchedSubstring,
      actualIndex: bestMatch.actualIndex,
    };
  }

  // If no exact match is found, fall back to fuzzy matching
  return fuzzyMatchAroundIndex(doc, query, expectedIndex);
}

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param text - The string to escape.
 * @returns The escaped string.
 */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// /**
//  * Fallback fuzzy matching function using difflib.
//  * @param doc - The document string.
//  * @param query - The query string.
//  * @param expectedIndex - The expected index.
//  * @returns An object containing the matched substring and its actual index.
//  */
// function fuzzyMatchAroundIndex(
//   doc: string,
//   query: string,
//   expectedIndex: number,
// ): {
//   matchedSubstring: string;
//   actualIndex: number;
// } {
//   // Define the window size
//   const windowSize = 500; // Adjust as needed
//   const startIndex = Math.max(0, expectedIndex - windowSize);
//   const endIndex = Math.min(doc.length, expectedIndex + windowSize);

//   const windowSubstring = doc.substring(startIndex, endIndex);

//   // Split the window and query into arrays of characters for difflib
//   const windowArray = windowSubstring.split("");
//   const queryArray = query.split("");

//   // Initialize the SequenceMatcher from difflib
//   const sequenceMatcher = new difflib.SequenceMatcher(queryArray, windowArray);

//   // Find the best matching block
//   const matches = sequenceMatcher.getMatchingBlocks();

//   let bestMatchSize = 0;
//   let bestMatchIndex = -1;

//   for (const match of matches) {
//     if (match.size > bestMatchSize) {
//       bestMatchSize = match.size;
//       bestMatchIndex = match.b;
//     }
//   }

//   if (bestMatchIndex !== -1 && bestMatchSize > 0) {
//     const matchedSubstring = windowSubstring.substr(
//       bestMatchIndex,
//       bestMatchSize,
//     );
//     const actualIndex = startIndex + bestMatchIndex;
//     return {
//       matchedSubstring,
//       actualIndex,
//     };
//   }

//   // If no match found
//   return {
//     matchedSubstring: "",
//     actualIndex: -1,
//   };
// }

// // Example usage:
