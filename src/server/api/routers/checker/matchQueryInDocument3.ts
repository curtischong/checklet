/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file

import { levenshteinDistance } from "@/server/api/routers/checker/editDistanceSimple";
import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch3";

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param s - The string to escape.
 * @returns The escaped string.
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const editDistanceContextRadiusForExactMatch = 50;

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
    const distancePenalty = distance < 0 ? Math.abs(distance) * 1.5 : distance;

    // Compute Levenshtein distance between the surrounding contexts
    const matchStart = matchIndexInDoc;
    const matchEnd = matchIndexInDoc + query.length;

    // Extract surrounding context for the match
    const matchContextStart = Math.max(
      0,
      matchStart - editDistanceContextRadiusForExactMatch,
    );
    const matchContextEnd = Math.min(
      doc.length,
      matchEnd + editDistanceContextRadiusForExactMatch,
    );
    const matchContextInDoc1 = doc.substring(
      matchContextStart,
      matchContextEnd,
    );

    // Compute Levenshtein distance between the two contexts
    const levenshteinPenalty = levenshteinDistance(
      matchContextInDoc1,
      queryWithContext,
    );

    // Combine penalties
    // in general, levenshteinPenalty is more important. because if so many characters are different, we probably got the distance wildly wrong. so it's more important
    const totalPenalty = distancePenalty + levenshteinPenalty * 2.5;
    // console.log(
    //   "distance penalty",
    //   distancePenalty,
    //   "levenshtein",
    //   levenshteinPenalty,
    //   "matchIndexInDoc",
    //   matchIndexInDoc,
    // );

    matches.push({
      matchedSubstring: match[0],
      actualIndex: matchIndexInDoc,
      penalty: totalPenalty,
      // penalty: levenshteinPenalty,
    });
  }

  if (matches.length > 0) {
    // console.log("matches.length", matches.length);
    // Sort matches by total penalty (lower penalty is better)
    matches.sort((a, b) => a.penalty - b.penalty);

    const bestMatch = matches[0]!;
    return {
      matchedSubstring: bestMatch.matchedSubstring,
      actualIndex: bestMatch.actualIndex,
    };
  }

  // console.log("fuzzy matching", query);
  // If no exact match is found, fall back to fuzzy matching
  return fuzzyMatchAroundIndex(doc, query, expectedIndex);
}
