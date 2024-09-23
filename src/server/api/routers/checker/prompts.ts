// with a <reason></reason> tag.

export const documentDelimiter = "<Fixed Doc>";

export const preprocessInstructions = (unprocessedTips: string) => {
  return `Given the below instructions, extract all of the tips/tricks/heuristics into a numbered list.

Surround each tip with <tip></tip> tags. If the instruction also has a reason for the tip, include that as well right after the tip tag
with a <reason></reason> tag.

---INSTRUCTIONS---
${unprocessedTips}`;
};

export const inferenceInstructions = (tips: string, doc: string) => {
  return `1) scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip:# that you used for the edit you’re making.

2) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip:#> tags. Also use the <delimiter> delimiter to specify the old text (on the left) and new text (on the right) like so:

This is a <tip:#>old text before your edit<delimiter>new text after your edit</tip:#> sentence.

Note: The # is the tip number you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---TIPS---
${tips}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1dot5 = (tips: string, doc: string) => {
  return `1) scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip:# that you used for the edit you’re making.

2) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip:#> tag:

This is a great <tip:#>new text after your edit</tip:#> sentence.

If your edit removes text, use the <tip:#> tag with no text inside:

This is a <tip:#></tip:#> sentence.

In the above example, the word "great" was removed.

Note: The # is the tip number you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---TIPS---
${tips}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1dot6 = (prompt: string, doc: string) => {
  return `1) Given the prompt, extract all of the tips/tricks/heuristics into a numbered list. Also include their reasons.

2) scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip:# that you used for the edit you’re making.

3) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip:#:reason> tags. Also use the <delimiter> delimiter to specify the old text (on the left) and new text (on the right) like so:

This is a <tip:#:reason="reason why this edit improves the old text">old text before your edit<delimiter>new text after your edit</tip:#> sentence.

Note: The # is the tip number you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---PROMPT---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1dot7 = (prompt: string, doc: string) => {
  return `1) scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip that you used for the edit you’re making.

2) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip|name|reason> tags. Also use the <delimiter> delimiter to specify the old text (on the left) and new text (on the right) like so:

This is a <tip|name of tip|reason why this edit improves the old text>old text before your edit<delimiter>new text after your edit</tip> sentence.

You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1dot8 = (prompt: string, doc: string) => {
  return `1) scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip that you used for the edit you’re making.

2) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip|name|reason> tags. Also use the <old> and <new> tags to specify the old text and new text:

This is a <tip|name of tip|reason why this edit improves the old text><old>old text before your edit</old><new>new text after your edit</new></tip> sentence.

You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1dot11 = (prompt: string, doc: string) => {
  return `1) scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip that you used for the edit you’re making.

2) output <END OF TRAIN OF THOUGHT/>

3) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip|name|reason> tags. Also use the <old> and <new> tags to specify the old text and new text:

This is a <tip|name of tip|reason why this edit improves the old text><old>old text before your edit</old><new>new text after your edit</new></tip> sentence.

You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1 = (tips: string, doc: string) => {
  return `Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip:# that you used for the edit you’re making.

---TIPS---
${tips}

---DOCUMENT---
${doc}`;
};

// export const inferenceInstructions2 = (doc: string) => {
//   return `Repeat the entire original text, but with the edits. For each edit, explicitly surround your edit with tip tags. Also use the <old:#:new> delimiter to specify the old text and new text like so:

// This is a <tip:#>old text before your edit<old:#:new>new text after yoru edit</tip:#> sentence.

// Note: The # is the tip number you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

// ---DOCUMENT---
// ${doc}`;
// };

export const inferenceInstructions2 = (doc: string) => {
  return `Repeat the entire original text, but with the edits. For each edit, explicitly surround your edit with tip tags like so:

This is a <tip:#>great sentence that </tip:#> was in the original text.

Note: The # is the tip number you followed above. You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---DOCUMENT---
${doc}`;
};
