export const levenshteinDistance = (s: string, t: string): number => {
  const m = s.length;
  const n = t.length;
  const dp: number[][] = [];

  // Base cases
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0]![j] = j;
  }

  // Compute distances
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
      } else {
        dp[i]![j] = Math.min(
          dp[i - 1]![j]! + 1, // Deletion
          dp[i]![j - 1]! + 1, // Insertion
          dp[i - 1]![j - 1]! + 1, // Substitution
        );
      }
    }
  }

  return dp[m]![n]!;
};
