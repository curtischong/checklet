/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  isAdjacent,
  merge,
  newDocRange,
  newEditOp,
  type EditOp,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";

// https://github.com/curtischong/checkletv1/blob/68103728393eee11683b6268fa86a8c6a62ce7c9/oldbackend/edit_distance.py
export function editDistanceOperationsWithClasses(
  str1: string,
  str2: string,
): EditOp[] {
  const m = str1.length,
    n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // Initialize the first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i; // Deletion cost
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // Insertion cost
  }

  // Compute the edit distance matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // No operation needed
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // Delete
            dp[i][j - 1], // Insert
            dp[i - 1][j - 1], // Replace
          );
      }
    }
  }

  // Trace back to find the operations
  const operations = [];
  let i = m,
    j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
      // Characters match, move diagonally
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      // Replace
      operations.push(newEditOp(newDocRange(i - 1, i), str2[j - 1]));
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      // Delete
      operations.push(newEditOp(newDocRange(i - 1, i), ""));
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      // Insert
      operations.push(newEditOp(newDocRange(i, i), str2[j - 1]));
      j--;
    } else {
      // Fallback for any remaining insertions or deletions
      if (i > 0) {
        operations.push(newEditOp(newDocRange(i - 1, i), ""));
        i--;
      } else if (j > 0) {
        operations.push(newEditOp(newDocRange(i, i), str2[j - 1]));
        j--;
      }
    }
  }

  // Consolidate adjacent operations
  const merged_ops: EditOp[] = [];
  for (const op of operations.reverse()) {
    if (
      merged_ops.length &&
      isAdjacent(merged_ops[merged_ops.length - 1].range, op.range)
    ) {
      merge(merged_ops[merged_ops.length - 1].range, op.range);
      merged_ops[merged_ops.length - 1].newString += op.newString;
    } else {
      merged_ops.push(newEditOp(op.range, op.newString));
    }
  }

  merged_ops.sort((a, b) => {
    return a.range.start - b.range.start;
  });

  return merged_ops;
}
