/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const editDistance = (s1: string, s2: string) => {
  const n1 = s1.length;
  const n2 = s2.length;

  const dp = Array.from(Array(2), () => new Array(n2 + 1).fill(0));
  for (let i = 0; i < n1; i++) {
    const curI = (i + 1) % 2;
    const prevI = i % 2;
    for (let j = 0; j < n2; j++) {
      if (s1[i] === s2[i]) {
        dp[curI]![j + 1] = dp[prevI]![j];
      } else {
        dp[curI]![j + 1] =
          Math.max(dp[prevI]![j], dp[prevI]![j + 1], dp[curI]![j]) + 1;
      }
    }
  }
  return dp[n1 % 2]![n2];
};
