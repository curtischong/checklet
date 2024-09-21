export const preprocessInstructions = (unprocessedTips: string) => {
  return `Given the below instructions, extract all of the tips/tricks/heuristics into a numbered list.

Surround each tip with <tip></tip> tags. If the instruction also has a reason for the tip, include that as well right after the tip tag
with a <reason></reason> tag.

---INSTRUCTIONS---
${unprocessedTips}`;
};

export const inferenceInstructions = (tips: string, doc: string) => {
  return `First scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. use chain of thought to think and consider if the edit really does improve the error in the sentence. Please consider if the rule:# is the correct rule for the edit you’re making. Finally. make a decision if you still want to apply the rule.

Then, repeat the entire fixed text, and for each edit, explicitly add <rule:#> </rule:#>tag around the edit. Where # is the rule you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all! Be very careful. Make sure the rule:# corresponds to the correct grammar rule.

---TIPS---
${tips}

---DOCUMENT---
${doc}`;
};
