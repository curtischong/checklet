export function removeExtraChunkAtStart(doc1: string, doc2: string): string {
  // Tokenize the documents into words
  const words1 = doc1.split(/\s+/);
  const words2 = doc2.split(/\s+/);

  // Number of words to consider for matching
  const N = 10; // Adjust as needed

  // Extract the first N words from doc1
  const firstWords1 = words1.slice(0, N);

  // Maximum offset to consider in doc2 (e.g., up to first 20% of words)
  const maxOffset = Math.min(words2.length, Math.floor(words2.length * 0.2));

  let bestMatchIndex = -1;
  let bestMatchScore = -1;

  for (let i = 0; i <= maxOffset; i++) {
    // Get N words starting from position i in words2
    const words2Slice = words2.slice(i, i + N);

    // Compute match score (number of matching words)
    let matchScore = 0;
    for (let j = 0; j < Math.min(firstWords1.length, words2Slice.length); j++) {
      if (firstWords1[j] === words2Slice[j]) {
        matchScore++;
      }
    }

    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore;
      bestMatchIndex = i;
    }

    // Early exit if we find a perfect match
    if (matchScore === N) {
      break;
    }
  }

  // Decide whether the match is good enough
  const threshold = Math.floor(N * 0.8); // e.g., 80% match
  if (bestMatchScore >= threshold) {
    // Remove the extra chunk at the start
    const newWords2 = words2.slice(bestMatchIndex).join(" ");
    return newWords2;
  } else {
    // No good match found, return doc2 as is
    return doc2;
  }
}
