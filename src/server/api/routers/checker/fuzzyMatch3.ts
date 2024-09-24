// https://chatgpt.com/share/66f33085-136c-800e-b4eb-03131b8eb3f4
/**
 * Finds the best fuzzy match of a query string within a document around a specific index.
 * Uses the Ratcliff-Obershelp algorithm (Gestalt pattern matching) at the token level.
 * @param doc - The document string.
 * @param query - The query string to match.
 * @param expectedIndex - The expected index where the query should appear in the document.
 * @param windowTokenSize - The number of tokens to include on each side of the expected index.
 * @returns An object containing the matching substring and its actual index in the document.
 */
export function fuzzyMatchAroundIndex(
  doc: string,
  query: string,
  expectedIndex: number,
  windowTokenSize = 50, // Adjust as needed
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
    matchedSubstring,
    actualIndex: actualCharIndex,
  };
}

/**
 * Tokenizes a string into an array of words (tokens).
 * @param text - The string to tokenize.
 * @returns An array of tokens.
 */
function tokenize(text: string): string[] {
  // Simple word tokenizer using regex
  return text.match(/\S+/g) || [];
}

/**
 * Converts an array of tokens back into a string.
 * @param tokens - The array of tokens.
 * @returns The concatenated string.
 */
function tokensToString(tokens: string[]): string {
  return tokens.join(" ");
}

/**
 * Creates a mapping from character indices to token indices.
 * @param text - The original text.
 * @param tokens - The tokens of the text.
 * @returns An array where each index corresponds to a character index in the text, and the value is the token index.
 */
function createCharToTokenIndexMap(text: string, tokens: string[]): number[] {
  const map = [];
  let charIndex = 0;
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex];
    // Map each character in the token to the current token index
    for (let i = 0; i < token.length; i++) {
      map[charIndex] = tokenIndex;
      charIndex++;
    }
    // Account for whitespace between tokens
    while (charIndex < text.length && /\s/.test(text[charIndex])) {
      map[charIndex] = tokenIndex;
      charIndex++;
    }
  }
  return map;
}

/**
 * Converts a token index back to a character index in the original text.
 * @param text - The original text.
 * @param tokens - The tokens of the text.
 * @param tokenIndex - The token index to convert.
 * @returns The character index in the original text.
 */
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

/**
 * Finds the best matching subsequence between two token arrays using the Ratcliff-Obershelp algorithm.
 * @param queryTokens - The token array of the query.
 * @param docTokens - The token array of the document window.
 * @returns An object containing the start and end indices of the best match in docTokens.
 */
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

/**
 * Computes the Ratcliff-Obershelp similarity between two token arrays.
 * @param tokensA - The first token array.
 * @param tokensB - The second token array.
 * @returns The similarity score between 0 and 1.
 */
function ratcliffObershelpSimilarity(
  tokensA: string[],
  tokensB: string[],
): number {
  const matches = findMatchingTokens(tokensA, tokensB);
  return (2 * matches.length) / (tokensA.length + tokensB.length);
}

/**
 * Recursively finds matching tokens between two token arrays.
 * @param tokensA - The first token array.
 * @param tokensB - The second token array.
 * @returns An array of matching tokens.
 */
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

/**
 * Finds the longest common subsequence between two token arrays.
 * @param tokensA - The first token array.
 * @param tokensB - The second token array.
 * @returns The longest common subsequence as an array of tokens.
 */
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

// Example usage
const doc =
  "This is a sample document where we will perform a fuzzy search to find a matching substring.";
const query = "sample document where we will perform fuzzy search";
const expectedIndex = doc.indexOf("sample"); // Let's assume we expect it around here

const result = fuzzyMatchAroundIndex(doc, query, expectedIndex);

console.log("Matched Substring:", result.matchedSubstring);
console.log("Actual Index:", result.actualIndex);
