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
  return `1) Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip that you used for the edit you’re making.

2) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip|name|reason> tags. Also use the <old> and <new> tags to specify the old text and new text:

This is a <tip|name of tip|reason why this edit improves the old text><old>old text before your edit</old><new>new text after your edit</new></tip> sentence.

You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1dot11 = (prompt: string, doc: string) => {
  return `1) Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip that you used for the edit you’re making.

2) Output <Doc Start>

3) Repeat the entire fixed text, and for each edit, explicitly surround your edit with <tip|name|reason> tags. Also use the <old> and <new> tags to specify the old text and new text:

This is a <tip|name of tip|reason why this edit improves the old text><old>old text before your edit</old><new>new text after your edit</new></tip> sentence.

You only want to change words and short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

4) Output <Doc End/>

---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inferenceInstructions1dot14 = () => {
  return `Repeat your previous response word for word. However, exclude the "chain of thought" portion of the text at the start. Do not make any more edits. Just repeat the rest as is.`;
};

export const inferenceInstructions1dot15 = (prompt: string, doc: string) => {
  return `1) Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip that you used for the edit you’re making.

Only edit short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

2) Repeat the entire fixed text. For each edit, explicitly surround your edit with <tip> tags. Use the <old> and <new> tags to specify the old text and new text. Format each edit like so:

This is a <tip|name of tip|reason why this edit improves the old text><old>old text before your edit</old><new>new text after your edit</new></tip> sentence.

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

export const fetchDoc = (doc: string): string => {
  return `This document has two parts: a train of thought and the edited document.
  Please extract the document. JUST RETURN THE DOCUMENT. DO NOT modify or edit it. just paste the second half back.

${doc}
`;
};

export const mergeDoc2TipsIntoDoc1 = (doc1: string, doc2: string): string => {
  return `Below are two documents. The I want you to merge the <tip|name of tip|reason for tip><old>old text before edit</old><new>new text after edit</new></tip> tags and their contents from the second document into the first.

Note: the second document contains edits (of doc1) OUTSIDE the tip tags. Do not migrate those over. I just want doc1 but with the tips ported over from doc2.

<Document 1>
${doc1}
</Document 1>

<Document 2>
${doc2}
</Document 2>`;
};

export const mergeDoc2TipsIntoDoc1Dot2 = (
  doc1: string,
  doc2: string,
): string => {
  return `Below are two documents. The I want you to merge the <tip|name of tip|reason for tip><old>old text before edit</old><new>new text after edit</new></tip> tags and their contents from the second document into the first.

Note: the second document contains edits (of doc1) OUTSIDE the tip tags. Do not migrate those over. I just want doc1 but with the tips ported over from doc2.

--- Example ---

Doc1:
I love rainy sundays.

Doc2:
I really love <tip|remove adjectives|it improves conciseness><old> **rainy**</old><new></new></tip> sundays.

You should return:
I love <tip|remove adjectives|it improves conciseness><old>rainy</old><new></new></tip> sundays.

Reasoning:
You recognize that the text in the <old></old> tag was incorrect. There was an extra space before the word "rainy" in the original text. There were also **bold** characters surrounding the word rain that you removed. In addition, the additional word "really" in doc2 was not migrated over since it's an edit not within the tip tag.
--- End of Example ---



<Document 1>
${doc1}
</Document 1>

<Document 2>
${doc2}
</Document 2>`;
};

export const inferenceInstructions4 = (prompt: string, doc: string) => {
  return `1) Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Spend time thinking and consider if the edit really does improve the error in the sentence. If this edit is appropriate, write down the tip that you used for the edit you’re making.

Only edit short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!

2) Repeat the entire fixed text with the edits.
---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const addTipTags4 = (doc1: string, doc2: string) => {
  return `Below are two documents. I want you to merge the edits of document 2 into document 1. The edits to port over are prepended to the start of document 2. Ignore whitespace and formatting edits.
  
For each edit you merge, surround the edit with <tip|name of tip|reason for tip><old>old text before edit</old><new>new text after edit</new></tip>.

I just want document 1 but with the edits ported over from document 2.

<Example 1>

Doc1:
I really love rainy Sundays.

Doc2:
I love rainy Sundays.

You should return:
I <tip|Remove Adverbs|it improves conciseness><old>really </old><new></new></tip>love rainy Sundays.

</End of Example 1>

<Example 2>

Doc1:
Howdy Sir

Doc2:
Hello Sir

You should return:
<tip|Be More Formal|It is better to be more formal when writing to a CEO><old>Howdy</old><new>Hello</new></tip> Sir

<End of Example 2/>

<Document 1>
${doc1}
</Document 1>

<Document 2>
${doc2}
</Document 2>`;
};

export const addTipTags4Dot1 = (doc1: string) => {
  return `I want you to merge the edits of your response with the original document.
  
For each edit you merge, surround the edit with <tip|name of tip|reason for tip><old>old text before edit</old><new>new text after edit</new></tip>.

I just want the original document but with the edits ported over from your response.

<Example 1>

Original Document:
I really love rainy Sundays.

Document with edits:
I love rainy Sundays.

You should return:
I <tip|Remove Adverbs|it improves conciseness><old>really </old><new></new></tip>love rainy Sundays.

</End of Example 1>

<Example 2>

Original Document:
Howdy Sir

Document with edits:
Hello Sir

You should return:
<tip|Be More Formal|It is better to be more formal when writing to a CEO><old>Howdy</old><new>Hello</new></tip> Sir

<End of Example 2/>

For reference, here is the original document you made your edits on:
${doc1}
`;
};

// don't even provide the original doc as reference. just use the message chain
export const addTipTags4Dot2 = () => {
  return `I want you to merge the edits of your response with the original document.
  
For each edit you merge, surround the edit with <tip|name of tip|reason for tip><old>old text before edit</old><new>new text after edit</new></tip>.

I just want the original document but with the edits ported over from your response.

<Example 1>

Original Document:
I really love rainy Sundays.

Document with edits:
I love rainy Sundays.

You should return:
I <tip|Remove Adverbs|it improves conciseness><old>really </old><new></new></tip>love rainy Sundays.

</End of Example 1>

<Example 2>

Original Document:
Howdy Sir

Document with edits:
Hello Sir

You should return:
<tip|Be More Formal|It is better to be more formal when writing to a CEO><old>Howdy</old><new>Hello</new></tip> Sir

<End of Example 2/>`;
};

export const addTipTags4Dot3 = () => {
  return `I want you to merge the edits of your response with the original document.
  
For each edit you merge, surround the edit with <tip><old>old text before edit</old><new>new text after edit</new><name>tip name</name><reason>reason for tip</reason></tip>.

I just want the original document but with the edits ported over from your response.

<Example 1>

Original Document:
I really love rainy Sundays.

Document with edits:
I love rainy Sundays.

You should return:
I <tip><old>really </old><new></new><name>Remove Adverbs</name><reason>It improves conciseness</reason></tip>love rainy Sundays.

</End of Example 1>

<Example 2>

Original Document:
Howdy Sir

Document with edits:
Hello Sir

You should return:
<tip><old>Howdy</old><new>Hello</new><name>Be more Formal</name><reason>It is better to be more formal when writing to a CEO</reason></tip> Sir

<End of Example 2/>`;
};

export const addTipTags4Dot4 = () => {
  return `I want you to merge the edits of your response with the original document. Only merge edits with a score of 7 or higher.
  
For each edit you merge, surround the edit with <tip><old>old text before edit</old><new>new text after edit</new><reason>reason for edit in accordance to the tip</reason><name>tip name</name></tip>.

I just want the original document but with the edits ported over from your response.

<Example 1>

Original Document:
I really love rainy Sundays.

Document with edits:
I love rainy Sundays.

You should return:
I <tip><old>really </old><new></new><reason>It improves conciseness</reason><name>Remove Adverbs</name></tip>love rainy Sundays.

</End of Example 1>

<Example 2>

Original Document:
Howdy Sir

Document with edits:
Hello Sir

You should return:
<tip><old>Howdy</old><new>Hello</new><reason>It is better to be more formal when writing to a CEO</reason><name>Be more Formal</name></tip> Sir

<End of Example 2/>`;
};

// Sometimes, a tip might not have an appropriate edit (you don't have enough information to change the text). Just don't add <new></new> tags in this case.

export const oneshot5dot1 = (prompt: string, doc: string) => {
  return `1) Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Base your edits on the provided tips. Use train of throught.
  
2) Evaluate each edit and consider if the edit really does improve the error in the sentence. Give each edit a score between 1-10 in terms of relevance to the tips. If this edit has a score of 7 and above, you will edit the original document with this edit. Otherwise, discard this edit.

3) Repeat the entire document with the edits.

Surround each edit with <tip><old>old text before edit</old><new>new text after edit</new><reason>reason for edit in accordance to the tip</reason><name>tip name</name></tip>.

Only edit short snippets that are objectively wrong. People don’t like it when you rewrite entire sentences. Some sentences don't need edits at all!


<Example 1>

Original Document:
I really love rainy Sundays.

Document with edits:
I love rainy Sundays.

You should return:
I <tip><old>really </old><new></new><reason>It improves conciseness</reason><name>Remove Adverbs</name></tip>love rainy Sundays.

</End of Example 1>

<Example 2>

Original Document:
Howdy Sir

Document with edits:
Hello Sir

You should return:
<tip><old>Howdy</old><new>Hello</new><reason>It is better to be more formal when writing to a CEO</reason><name>Be more Formal</name></tip> Sir

<End of Example 2/>


---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inference6 = (prompt: string, doc: string) => {
  return `1) Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Base your edits on the provided tips. Use train of throught.
  
2) Evaluate each edit and score each one based on how well it follows the tips. Give each edit a score between 1-10 in terms of relevance to the tips.

---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};

export const inference7 = (prompt: string, doc: string) => {
  // return `1) Scan over the entire doc and list out all of the possible fixes and the edit you intend to use to fix it. Base your edits on the provided tips. Use train of throught.
  return `1) For each tip, list out how you can use that tip to fix/edit sections in the document. Only make edits if it corresponds to a tip. Use train of throught.
  
2) Evaluate each edit and score each one based on how well it follows the tips. Ask yourself if the edit you proposed improves the text and follows the tip. Give each edit a score between 1-10 in terms of relevance to the tips.

---TIPS---
${prompt}

---DOCUMENT---
${doc}`;
};
