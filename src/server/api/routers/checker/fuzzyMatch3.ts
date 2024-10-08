/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file

// v1:
// https://chatgpt.com/share/66f33085-136c-800e-b4eb-03131b8eb3f4
// v2 - the matchedSubstring that is returned is now the EXACT substring (with whitespace and everything from the original doc):
// https://chatgpt.com/share/67056cc8-bbb0-800e-ad63-a5c8bef746e1

interface Token {
  text: string;
  start: number; // inclusive
  end: number; // exclusive
}

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
  // Tokenize the document and query, capturing start and end indices
  const docTokens = tokenizeWithIndices(doc);
  // const docTokenTexts = docTokens.map((token) => token.text);

  const queryTokens = tokenizeWithIndices(query).map((token) => token.text);

  // Find token index corresponding to expectedIndex
  const expectedTokenIndex = findTokenIndexAtCharIndex(
    docTokens,
    expectedIndex,
  );

  // Define the token window
  const startTokenIndex = Math.max(0, expectedTokenIndex - windowTokenSize);
  const endTokenIndex = Math.min(
    docTokens.length,
    expectedTokenIndex + windowTokenSize,
  );

  // Extract the token window from the document tokens
  const windowTokens = docTokens.slice(startTokenIndex, endTokenIndex);
  const windowTokenTexts = windowTokens.map((token) => token.text);

  // Perform fuzzy matching using Ratcliff-Obershelp algorithm
  const { bestMatchStart, bestMatchEnd } = findBestTokenSequenceMatch(
    queryTokens,
    windowTokenTexts,
  );

  // If no match is found
  if (bestMatchStart === -1 || bestMatchEnd === -1) {
    return {
      matchedSubstring: "",
      actualIndex: -1,
    };
  }

  // Get the matched tokens
  const matchedTokens = windowTokens.slice(bestMatchStart, bestMatchEnd + 1);

  // Get the start and end character indices from the matched tokens
  const actualCharStartIndex = matchedTokens[0].start;
  const actualCharEndIndex = matchedTokens[matchedTokens.length - 1].end;

  // Extract the exact matched substring from the original document
  const matchedSubstring = doc.substring(
    actualCharStartIndex,
    actualCharEndIndex,
  );

  // The actual index is the start index of the matched substring
  return {
    matchedSubstring,
    actualIndex: actualCharStartIndex,
  };
}

/**
 * Tokenizes a string into an array of tokens with start and end positions.
 * @param text - The string to tokenize.
 * @returns An array of Token objects.
 */
function tokenizeWithIndices(text: string): Token[] {
  const tokens: Token[] = [];
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return tokens;
}

/**
 * Finds the token index corresponding to a character index in the document.
 * @param tokens - The array of tokens.
 * @param charIndex - The character index.
 * @returns The token index.
 */
function findTokenIndexAtCharIndex(tokens: Token[], charIndex: number): number {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.start <= charIndex && charIndex < token.end) {
      return i;
    }
  }
  // If the character index is not within any token, find the closest token
  if (charIndex < tokens[0].start) {
    return 0;
  }
  if (charIndex >= tokens[tokens.length - 1].end) {
    return tokens.length - 1;
  }
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i].end <= charIndex && charIndex < tokens[i + 1].start) {
      return i;
    }
  }
  return tokens.length - 1; // Default to the last token
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

  const docLength = docTokens.length;
  const queryLength = queryTokens.length;

  // Optimize by considering windows of length similar to queryTokens length
  const minLength = Math.max(1, queryLength - 5);
  const maxLength = queryLength + 5;

  for (let offset = 0; offset <= docLength - minLength; offset++) {
    for (
      let length = minLength;
      length <= maxLength && offset + length <= docLength;
      length++
    ) {
      const docSlice = docTokens.slice(offset, offset + length);
      const score = ratcliffObershelpSimilarity(queryTokens, docSlice);

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatchStart = offset;
        bestMatchEnd = offset + length - 1;
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

  return [...leftMatches, common[0], ...rightMatches];
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
    .fill(null)
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

// // Example usage
// const doc =
//   "This is   a sample   document where we will   perform a fuzzy search to find a matching substring.";
// const query = "sample document where we will perform fuzzy search";
// const expectedIndex = doc.indexOf("sample"); // Let's assume we expect it around here

// const result = fuzzyMatchAroundIndex(doc, query, expectedIndex);

// console.log("Matched Substring:", result.matchedSubstring);
// console.log("Actual Index:", result.actualIndex);
