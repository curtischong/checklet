// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file
// https://chatgpt.com/share/66f43c41-e500-800e-b7cf-625335b24802

export function fuzzyMatchAroundIndex(
  doc: string,
  query: string,
  expectedIndex: number,
  windowTokenSize = 50,
): {
  matchedSubstring: string;
  actualIndex: number;
} {
  // Tokenize the document and query
  const docTokens = tokenize(doc);
  const queryTokens = tokenize(query);

  // Map character index to token index
  const charToTokenIndexMap = createCharToTokenIndexMap(doc, docTokens);

  // Estimate the token index corresponding to the expected character index
  const expectedTokenIndex = charToTokenIndexMap[expectedIndex];

  // Define the token window
  const startTokenIndex = Math.max(0, expectedTokenIndex - windowTokenSize);
  const endTokenIndex = Math.min(
    docTokens.length,
    expectedTokenIndex + windowTokenSize,
  );

  // Extract the token window from the document tokens
  const windowTokens = docTokens.slice(startTokenIndex, endTokenIndex);

  // Perform fuzzy matching using Ratcliff-Obershelp algorithm
  const { bestMatchStart, bestMatchEnd } = findBestTokenSequenceMatch(
    queryTokens,
    windowTokens,
  );

  // If no match is found
  if (bestMatchStart === -1 || bestMatchEnd === -1) {
    return {
      matchedSubstring: "",
      actualIndex: -1,
    };
  }

  // Convert the matched tokens back to a substring
  const matchedTokens = windowTokens.slice(bestMatchStart, bestMatchEnd + 1);
  const matchedSubstring = tokensToString(matchedTokens);

  // Calculate the actual character index in the document
  const actualTokenIndex = startTokenIndex + bestMatchStart;
  const actualCharIndex = tokenIndexToCharIndex(
    doc,
    docTokens,
    actualTokenIndex,
  );

  return {
    matchedSubstring: matchedSubstring,
    actualIndex: actualCharIndex,
  };
}

// Tokenize a string into an array of words (tokens).
function tokenize(text: string): string[] {
  return text.match(/\S+/g) || [];
}

// Convert an array of tokens back into a string.
function tokensToString(tokens: string[]): string {
  return tokens.join(" ");
}

// Creates a mapping from character indices to token indices.
function createCharToTokenIndexMap(text: string, tokens: string[]): number[] {
  const charToTokenMap: number[] = [];
  let charIndex = 0;
  tokens.forEach((token, tokenIndex) => {
    for (let i = 0; i < token.length; i++) {
      charToTokenMap[charIndex] = tokenIndex;
      charIndex++;
    }
    // Account for whitespace between tokens
    while (charIndex < text.length && /\s/.test(text[charIndex])) {
      charToTokenMap[charIndex] = tokenIndex;
      charIndex++;
    }
  });
  return charToTokenMap;
}

// Converts a token index back to a character index in the original text.
function tokenIndexToCharIndex(
  text: string,
  tokens: string[],
  tokenIndex: number,
): number {
  let charIndex = 0;
  for (let i = 0; i < tokenIndex; i++) {
    charIndex += tokens[i].length;
    // Skip over the whitespace after the token
    while (charIndex < text.length && /\s/.test(text[charIndex])) {
      charIndex++;
    }
  }
  return charIndex;
}

// Perform fuzzy matching using Ratcliff-Obershelp algorithm
function findBestTokenSequenceMatch(
  queryTokens: string[],
  docTokens: string[],
): { bestMatchStart: number; bestMatchEnd: number } {
  let bestMatchScore = -1;
  let bestMatchStart = -1;
  let bestMatchEnd = -1;

  // Use a sliding window over docTokens
  for (let i = 0; i < docTokens.length; i++) {
    for (let j = i; j < docTokens.length; j++) {
      const windowSlice = docTokens.slice(i, j + 1);
      const score = ratcliffObershelpSimilarity(queryTokens, windowSlice);

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatchStart = i;
        bestMatchEnd = j;
      }
    }
  }

  return { bestMatchStart, bestMatchEnd };
}

// Compute the Ratcliff-Obershelp similarity between two token arrays
function ratcliffObershelpSimilarity(
  tokensA: string[],
  tokensB: string[],
): number {
  const matches = findMatchingTokens(tokensA, tokensB);
  return (2 * matches.length) / (tokensA.length + tokensB.length);
}

// Recursively finds matching tokens between two token arrays
function findMatchingTokens(tokensA: string[], tokensB: string[]): string[] {
  const common = longestCommonSubsequence(tokensA, tokensB);

  if (common.length === 0) {
    return [];
  }

  const indexA = tokensA.indexOf(common[0]);
  const indexB = tokensB.indexOf(common[0]);

  const leftMatches = findMatchingTokens(
    tokensA.slice(0, indexA),
    tokensB.slice(0, indexB),
  );
  const rightMatches = findMatchingTokens(
    tokensA.slice(indexA + 1),
    tokensB.slice(indexB + 1),
  );

  return [...leftMatches, ...common, ...rightMatches];
}

// Finds the longest common subsequence between two token arrays
function longestCommonSubsequence(
  tokensA: string[],
  tokensB: string[],
): string[] {
  const m = tokensA.length;
  const n = tokensB.length;
  const table: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  // Build the LCS table
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (tokensA[i] === tokensB[j]) {
        table[i][j] = table[i + 1][j + 1] + 1;
      } else {
        table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
  }

  // Reconstruct the LCS from the table
  let i = 0;
  let j = 0;
  const lcs: string[] = [];
  while (i < m && j < n) {
    if (tokensA[i] === tokensB[j]) {
      lcs.push(tokensA[i]);
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  return lcs;
}
