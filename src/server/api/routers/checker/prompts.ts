// with a <reason></reason> tag.

export const documentDelimiter = "---FIXED DOCUMENT---";

export const preprocessInstructions = (unprocessedTips: string) => {
  return `Given the below instructions, extract all of the tips/tricks/heuristics into a numbered list.

Surround each tip with <tip></tip> tags. If the instruction also has a reason for the tip, include that as well right after the tip tag
with a <reason></reason> tag.

---INSTRUCTIONS---
${unprocessedTips}`;
};

export const inferenceInstructions = (tips: string, doc: string) => {
  return `First scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip:# that you used for the edit you’re making.

Then, repeat the entire fixed text, and for each edit, explicitly surround your edit with tip tags like so:

This is a <tip:#>great sentence that </tip:#> was in the original text.

Note: The # is the tip number you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---TIPS---
${tips}

---DOCUMENT---
${doc}`;
};
