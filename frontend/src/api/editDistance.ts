import { DocRange, EditOp, newEditOp } from "@api/ApiTypes";

// https://github.com/curtischong/yourwriterfriend/blob/68103728393eee11683b6268fa86a8c6a62ce7c9/oldbackend/edit_distance.py
export function editDistanceOperationsWithClasses(
    str1: string,
    str2: string,
): EditOp[] {
    // Create a matrix for storing edit distances
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
                        dp[i - 1][j - 1],
                    ); // Replace
            }
        }
    }

    // Trace back to find the operations
    const operations = [];
    let i = m,
        j = n;
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            i--;
            j--;
        } else if (dp[i][j] === dp[i - 1][j - 1] + 1) {
            // Replace
            operations.push(newEditOp(new DocRange(i - 1, i), str2[j - 1]));
            i--;
            j--;
        } else if (dp[i][j] === dp[i - 1][j] + 1) {
            // Delete
            operations.push(newEditOp(new DocRange(i - 1, i), ""));
            i--;
        } else if (dp[i][j] === dp[i][j - 1] + 1) {
            // Insert
            operations.push(newEditOp(new DocRange(j - 1, j), str2[j - 1]));
            j--;
        }
    }

    // Handle remaining characters in str1 (deletions) or str2 (insertions)
    while (i > 0) {
        operations.push(newEditOp(new DocRange(i - 1, i), ""));
        i--;
    }
    while (j > 0) {
        operations.push(newEditOp(new DocRange(j - 1, j), str2[j - 1]));
        j--;
    }

    // Consolidate adjacent operations
    const merged_ops: EditOp[] = [];
    for (const op of operations.reverse()) {
        if (
            merged_ops.length &&
            merged_ops[merged_ops.length - 1].range.isAdjacent(op.range)
        ) {
            merged_ops[merged_ops.length - 1].range.merge(op.range);
            merged_ops[merged_ops.length - 1].newString += op.newString;
        } else {
            merged_ops.push(newEditOp(op.range, op.newString));
        }
    }

    return merged_ops;
}

// Example usage
// console.log(editDistanceOperationsWithClasses("kitten", "sittinggg"));
