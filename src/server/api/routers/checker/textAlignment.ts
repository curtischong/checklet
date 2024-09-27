/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as difflib from "difflib";
// from https://chatgpt.com/share/66f0be8c-2d1c-800e-a2e3-79eb22f5d80d

function tokenizeDoc(doc: string): string[] {
  // Regular expression to match tip tags
  const tipTagPattern =
    /<tip\|([^|]+)\|([^>]+)><old>([^<]+)<\/old><new>([^<]+)<\/new><\/tip>/s;

  // Tokenize the document, keeping tip tags as single tokens
  const tokens: string[] = [];
  let pos = 0;

  while (pos < doc.length) {
    const tipMatch = tipTagPattern.exec(doc.substring(pos));

    if (tipMatch && tipMatch.index === 0) {
      // Add the entire tip tag as a single token
      tokens.push(tipMatch[0]);
      pos += tipMatch[0].length;
    } else {
      // Add the next character as a token
      tokens.push(doc[pos]!);
      pos += 1;
    }
  }

  return tokens;
}

// https://en.wikipedia.org/wiki/Gestalt_pattern_matching
// PERF: "The execution time of the algorithm is O ( n 3 ) {displaystyle O(n^{3})} in a worst case and O ( n 2 ) {displaystyle O(n^{2})} in an average case."
export function postprocessDoc(doc1: string, doc2: string): string {
  // Tokenize both documents
  const tokens1 = Array.from(doc1); // For doc1, we can tokenize by character
  const tokens2 = tokenizeDoc(doc2);
  console.log(tokens2.filter((t) => t.length > 1));

  // Use SequenceMatcher to align the tokens
  const matcher = new difflib.SequenceMatcher(null, tokens1, tokens2);
  const opcodes = matcher.getOpcodes();

  const doc3Tokens: string[] = [];

  for (const opcode of opcodes) {
    const [tag, i1, i2, j1, j2] = opcode;

    if (tag === "equal") {
      // Tokens are the same; copy from doc1
      doc3Tokens.push(...tokens1.slice(i1, i2));
    } else if (tag === "insert") {
      // Tokens inserted in doc2
      const insertedTokens = tokens2.slice(j1, j2);
      for (const token of insertedTokens) {
        if (token.startsWith("<tip|")) {
          // Insert the tip tag into doc3
          doc3Tokens.push(token);
        }
        // Else: ignore other insertions (changes outside tip tags)
      }
    } else if (tag === "delete") {
      // Tokens deleted from doc1; ignore (keep original from doc1)
      doc3Tokens.push(...tokens1.slice(i1, i2));
    } else if (tag === "replace") {
      // Tokens replaced
      const replacedTokens = tokens2.slice(j1, j2);
      const insertedTipTags = replacedTokens.filter((token) =>
        token.startsWith("<tip|"),
      );

      if (insertedTipTags.length > 0) {
        // Insert the tip tags into doc3
        for (const token of insertedTipTags) {
          doc3Tokens.push(token);
        }
        // Advance i1 to skip the old text in doc1 that was replaced
      } else {
        // No tip tags; copy from doc1
        doc3Tokens.push(...tokens1.slice(i1, i2));
      }
    }
  }

  // Reconstruct doc3 from tokens
  return doc3Tokens.join("");
}

// // Example usage:
// const doc1 = "sentence 1. This is a sentence that needs editing.";
// const doc2 =
//   "Irrelevant text. sentence 1. This is a <tip:1>sentence<old:1:new>line</tip:1> that needs editing. More irrelevant text.";

// const result = postprocessDoc(doc1, doc2);
// console.log(result);
