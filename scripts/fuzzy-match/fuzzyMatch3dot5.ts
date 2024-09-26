// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file

// import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch3";
import { fuzzyMatchAroundIndex } from "@/../scripts/fuzzy-match/run3";

export function fuzzyMatchAroundIndexWithRegex(
  doc: string,
  query: string,
  expectedIndex: number,
  windowTokenSize = 50, // Fallback window size for fuzzy matching
): {
  matchedSubstring: string;
  actualIndex: number;
} {
  // Step 1: Attempt exact match using regex
  const startRange = Math.max(0, expectedIndex - 100);
  const endRange = Math.min(doc.length, expectedIndex + 300);
  const docSlice = doc.slice(startRange, endRange);

  // Escape special regex characters from query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create regex to match the exact query
  const regex = new RegExp(escapedQuery, "g");
  const match = [...docSlice.matchAll(regex)];

  // If we find any match, return the one closest to the expected index
  if (match.length > 0) {
    let closestMatch = match[0];
    let closestDistance = Math.abs(
      startRange + closestMatch.index - expectedIndex,
    );

    for (const m of match) {
      const matchDistance = Math.abs(startRange + m.index - expectedIndex);
      if (matchDistance < closestDistance) {
        closestMatch = m;
        closestDistance = matchDistance;
      }
    }

    const actualIndex = startRange + closestMatch.index;
    return {
      matchedSubstring: closestMatch[0],
      actualIndex: actualIndex,
    };
  }

  // Step 2: Fallback to fuzzy matching if no exact match is found
  return fuzzyMatchAroundIndex(doc, query, expectedIndex, windowTokenSize);
}
