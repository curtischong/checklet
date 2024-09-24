import {
  resumeWithChainOfThought,
  sample_resume_2019,
} from "scripts/samples/rizzume";

console.log(
  removeExtraChunkAtStart(sample_resume_2019, resumeWithChainOfThought),
);

import * as difflib from "difflib";

function removeExtraChunkAtStart(doc1: string, doc2: string): string {
  // Split the documents into arrays of words
  const doc1Words = doc1.split(/\s+/);
  const doc2Words = doc2.split(/\s+/);

  // Create a SequenceMatcher instance
  const matcher = new difflib.SequenceMatcher(doc1Words, doc2Words);

  // Get matching blocks
  const matchingBlocks = matcher.getOpcodes();
  console.log("matchingBlocks", matchingBlocks);

  // Find the index in doc2 where the main content starts
  let startIndexInDoc2 = 0;
  for (const [tag, i1, i2, j1, j2] of matchingBlocks) {
    if (tag === "equal" && j2 - j1 > 0) {
      startIndexInDoc2 = j1;
      break;
    }
  }

  // Remove the extra chunk at the start of doc2
  const newDoc2Words = doc2Words.slice(startIndexInDoc2);
  const newDoc2 = newDoc2Words.join(" ");

  return newDoc2;
}
