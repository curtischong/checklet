function removeExtraChunkAtStart(doc1: string, doc2: string): string {
  // Tokenize the documents into words
  const words1 = doc1.split(/\s+/);
  const words2 = doc2.split(/\s+/);

  // Parameters
  const windowSize = 50; // Number of words to compare
  const maxOffset = Math.min(
    words2.length - windowSize,
    Math.floor(words2.length * 0.2),
  );
  let minDistance = Infinity;
  let bestMatchIndex = -1;

  // Precompute the first windowSize words from doc1
  const words1Window = words1.slice(0, windowSize);

  for (let i = 0; i <= maxOffset; i++) {
    const words2Window = words2.slice(i, i + windowSize);
    const distance = levenshteinDistance(words1Window, words2Window);

    if (distance < minDistance) {
      minDistance = distance;
      bestMatchIndex = i;
    }

    // Early exit if we find an exact match
    if (distance === 0) {
      break;
    }
  }

  // Decide whether the match is good enough based on a threshold
  const threshold = Math.floor(windowSize * 0.3); // Adjust as needed
  if (minDistance <= threshold) {
    // Remove the extra chunk at the start
    const newWords2 = words2.slice(bestMatchIndex).join(" ");
    return newWords2;
  } else {
    // No good match found, return doc2 as is
    return doc2;
  }
}

// Helper function to compute Levenshtein distance between two arrays
function levenshteinDistance(a: string[], b: string[]): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];

  // Initialize DP table
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Compute distances
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const substitution = dp[i - 1][j - 1] + 1;
        const insertion = dp[i][j - 1] + 1;
        const deletion = dp[i - 1][j] + 1;
        dp[i][j] = Math.min(substitution, insertion, deletion);
      }
    }
  }

  return dp[m][n];
}

import {
  resumeWithChainOfThought,
  sample_resume_2019,
} from "scripts/samples/rizzume";

console.log(
  removeExtraChunkAtStart(sample_resume_2019, resumeWithChainOfThought),
);
