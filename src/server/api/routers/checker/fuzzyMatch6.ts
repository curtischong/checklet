// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file
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

  // Handle cases where the expected index maps to whitespace or is undefined
  const validExpectedTokenIndex =
    expectedTokenIndex >= 0 ? expectedTokenIndex : 0;

  // Define the token window
  const startTokenIndex = Math.max(
    0,
    validExpectedTokenIndex - windowTokenSize,
  );
  const endTokenIndex = Math.min(
    docTokens.length,
    validExpectedTokenIndex + windowTokenSize,
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
 * Tokenizes a string into an array of tokens, preserving compound words and special cases.
 * @param text - The string to tokenize.
 * @returns An array of tokens.
 */
function tokenize(text: string): string[] {
  // Tokenize the text into words (including periods within words) and punctuation
  return text.match(/\b\w[\w.-]*\w|\w|[^\w\s]/g) ?? [];
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
  let tokenIndex = 0;

  // Use the same regex as in the tokenizer to match tokens and whitespace
  const regex = /\b\w[\w.-]*\w|\w|[^\w\s]|\s+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null && tokenIndex <= tokens.length) {
    const matchedText = match[0];
    const length = matchedText.length;

    // Map each character in the match to the appropriate token index
    if (/\s+/.test(matchedText)) {
      // It's whitespace; map to -1
      for (let i = 0; i < length; i++) {
        map[charIndex++] = -1;
      }
    } else {
      // It's a token; map to the current token index
      for (let i = 0; i < length; i++) {
        map[charIndex++] = tokenIndex;
      }
      tokenIndex++;
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
  let currentTokenIndex = 0;

  // Use the same regex as in the tokenizer
  const regex = /\b\w[\w.-]*\w|\w|[^\w\s]|\s+/g;
  let match: RegExpExecArray | null;

  while (
    (match = regex.exec(text)) !== null &&
    currentTokenIndex < tokenIndex
  ) {
    const matchedText = match[0];

    if (/\s+/.test(matchedText)) {
      // It's whitespace; increment charIndex
      charIndex += matchedText.length;
    } else {
      // It's a token; increment charIndex and currentTokenIndex
      charIndex += matchedText.length;
      currentTokenIndex++;
    }
  }

  return charIndex;
}

/**
 * Converts an array of tokens back into a string, adding spaces where necessary.
 * @param tokens - The array of tokens.
 * @returns The concatenated string.
 */
function tokensToString(tokens: string[]): string {
  return tokens.join(" ");
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

  // Limit the maximum length of the window to avoid performance issues
  const maxWindowLength = Math.min(queryLength * 2, docLength);

  // Use a sliding window over docTokens
  for (
    let windowSize = queryLength;
    windowSize <= maxWindowLength;
    windowSize++
  ) {
    for (let i = 0; i <= docLength - windowSize; i++) {
      const windowSlice = docTokens.slice(i, i + windowSize);
      const score = ratcliffObershelpSimilarity(queryTokens, windowSlice);

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatchStart = i;
        bestMatchEnd = i + windowSize - 1;

        // If we find a perfect match, we can break early
        if (score === 1) {
          return { bestMatchStart, bestMatchEnd };
        }
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
  const commonSubsequence = longestCommonSubsequence(tokensA, tokensB);

  if (commonSubsequence.length === 0) {
    return [];
  }

  const indexA = tokensA.indexOf(commonSubsequence[0]);
  const indexB = tokensB.indexOf(commonSubsequence[0]);

  const leftMatches = findMatchingTokens(
    tokensA.slice(0, indexA),
    tokensB.slice(0, indexB),
  );
  const rightMatches = findMatchingTokens(
    tokensA.slice(indexA + 1),
    tokensB.slice(indexB + 1),
  );

  return [...leftMatches, ...commonSubsequence, ...rightMatches];
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
//   "Experienced in Node.js development, including building RESTful APIs.";
// const query = "Node.js";
// const expectedIndex = doc.indexOf("Node.js"); // Let's assume we expect it around here

// const result = fuzzyMatchAroundIndex(doc, query, expectedIndex);

// console.log("Matched Substring:", result.matchedSubstring);
// console.log("Actual Index:", result.actualIndex);

// // Output the substring from the original document using actualIndex
// const start = result.actualIndex;
// const end = start + result.matchedSubstring.length;
// const extractedSubstring = doc.substring(start, end);

// console.log(`Extracted Substring: "${extractedSubstring}"`);
// console.log(
//   `Does the extracted substring match the matched substring? ${extractedSubstring === result.matchedSubstring}`,
// );
