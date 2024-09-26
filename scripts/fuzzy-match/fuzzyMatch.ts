// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file
// https://chatgpt.com/share/66f185c3-1924-800e-b4b4-8b270c342397

// TODO: to make the match even better, we should try matching the text AROUND the postion in the original doc
export function fuzzyMatch(
  doc: string,
  query: string,
  idx: number,
  allowedDeviation: number,
): { matchingSubstring: string; actualIndex: number } {
  const lenQuery = query.length;
  const delta = allowedDeviation;
  const windowSize = lenQuery + 2 * delta;

  // Define search window in doc
  const startPos = Math.max(0, idx - delta);
  const endPos = Math.min(doc.length, idx + lenQuery + delta);
  const windowDoc = doc.substring(startPos, endPos);

  // Initialize scoring parameters
  const matchScore = 2;
  const mismatchPenalty = -1;
  const gapPenalty = -1;

  const n = query.length;
  const m = windowDoc.length;
  const scoreMatrix: number[][] = Array.from(Array(n + 1), () =>
    Array(m + 1).fill(0),
  );
  let maxScore = 0;
  let maxPos: [number, number] = [0, 0];

  // Fill the score matrix
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const match =
        scoreMatrix[i - 1][j - 1] +
        (query[i - 1] === windowDoc[j - 1] ? matchScore : mismatchPenalty);
      const deleteOp = scoreMatrix[i - 1][j] + gapPenalty;
      const insertOp = scoreMatrix[i][j - 1] + gapPenalty;
      const cellScore = Math.max(0, match, deleteOp, insertOp);
      scoreMatrix[i][j] = cellScore;

      if (cellScore > maxScore) {
        maxScore = cellScore;
        maxPos = [i, j];
      }
    }
  }

  // Traceback to get the alignment
  let [i, j] = maxPos;
  let alignedQuery: string[] = [];
  let alignedWindow: string[] = [];

  while (i > 0 && j > 0 && scoreMatrix[i][j] > 0) {
    if (
      scoreMatrix[i][j] ===
      scoreMatrix[i - 1][j - 1] +
        (query[i - 1] === windowDoc[j - 1] ? matchScore : mismatchPenalty)
    ) {
      alignedQuery.push(query[i - 1]);
      alignedWindow.push(windowDoc[j - 1]);
      i -= 1;
      j -= 1;
    } else if (scoreMatrix[i][j] === scoreMatrix[i - 1][j] + gapPenalty) {
      alignedQuery.push(query[i - 1]);
      alignedWindow.push("-");
      i -= 1;
    } else {
      alignedQuery.push("-");
      alignedWindow.push(windowDoc[j - 1]);
      j -= 1;
    }
  }

  alignedQuery = alignedQuery.reverse();
  alignedWindow = alignedWindow.reverse();

  const matchStartInWindow = j;
  const actualIndex = startPos + matchStartInWindow;

  const matchLength = alignedWindow.filter((char) => char !== "-").length;
  const matchingSubstring = doc.substring(
    actualIndex,
    actualIndex + matchLength,
  );
  console.log("actualIndex", actualIndex);
  console.log("originalIndex", idx);

  return { matchingSubstring, actualIndex };
}
