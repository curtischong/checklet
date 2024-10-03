/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file

import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch3";

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param s - The string to escape.
 * @returns The escaped string.
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Computes the Levenshtein distance between two strings.
 * @param s - First string.
 * @param t - Second string.
 * @returns The Levenshtein distance.
 */
export const levenshteinDistance = (s: string, t: string): number => {
  const m = s.length;
  const n = t.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        s[i - 1] === t[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(
              dp[i - 1][j - 1] + 1, // Substitution
              dp[i][j - 1] + 1, // Insertion
              dp[i - 1][j] + 1, // Deletion
            );
    }
  }
  return dp[m][n];
};

/**
 * Finds the best match of a query string within a document around a specific index.
 * It penalizes exact matches based on their distance from the expected index and the
 * Levenshtein distance between their surrounding context and the expected context.
 * @param doc - The document string.
 * @param query - The query string to match.
 * @param expectedIndex - The expected index where the query should appear in the document.
 * @returns An object containing the matching substring and its actual index in the document.
 */
export function matchQueryInDocument(
  doc: string,
  query: string,
  queryWithContext: string,
  expectedIndex: number,
): {
  matchedSubstring: string;
  actualIndex: number;
} {
  // Define the search window from expectedIndex - 700 to expectedIndex + 700
  const startIndex = Math.max(0, expectedIndex - 700);
  const endIndex = Math.min(doc.length, expectedIndex + 700);
  const windowSubstring = doc.substring(startIndex, endIndex);

  // Escape special regex characters in the query
  const escapedQuery = escapeRegExp(query);

  // Create a regex for the exact match
  const regex = new RegExp(escapedQuery, "g");

  // Find all exact matches in the window substring
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
    const distancePenalty = distance < 0 ? Math.abs(distance) * 2 : distance;

    // Compute Levenshtein distance between the surrounding contexts
    const contextRadius = 50; // Number of characters before and after the match to consider
    const matchStart = matchIndexInDoc;
    const matchEnd = matchIndexInDoc + query.length;

    // Extract surrounding context for the match
    const matchContextStart = Math.max(0, matchStart - contextRadius);
    const matchContextEnd = Math.min(doc.length, matchEnd + contextRadius);
    const matchContext = doc.substring(matchContextStart, matchContextEnd);

    // Extract expected surrounding context at expectedIndex
    const expectedContextStart = Math.max(0, expectedIndex - contextRadius);
    const expectedContextEnd = Math.min(
      doc.length,
      expectedIndex + query.length + contextRadius,
    );
    const expectedContext = doc.substring(
      expectedContextStart,
      expectedContextEnd,
    );

    // Compute Levenshtein distance between the two contexts
    const levenshteinPenalty = levenshteinDistance(
      matchContext,
      expectedContext,
    );

    // Combine penalties
    const totalPenalty = distancePenalty + levenshteinPenalty;
    console.log(
      "distance penalty",
      distancePenalty,
      "levenshtein",
      levenshteinPenalty,
    );

    matches.push({
      matchedSubstring: match[0],
      actualIndex: matchIndexInDoc,
      // penalty: totalPenalty,
      penalty: levenshteinPenalty,
    });
  }

  if (matches.length > 0) {
    // Sort matches by total penalty (lower penalty is better)
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
