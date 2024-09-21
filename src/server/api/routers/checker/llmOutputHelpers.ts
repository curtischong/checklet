export interface Tip {
  tip: string;
  reason: string;
}

export function extractTipsAndReasons(input: string): Tip[] {
  const tipReasonPairs: { tip: string; reason: string }[] = [];
  let i = 0;
  const length = input.length;

  while (i < length) {
    const tipStart = input.indexOf("<tip>", i);
    if (tipStart === -1) break; // No more tips found
    const tipEnd = input.indexOf("</tip>", tipStart);
    const tip = input.slice(tipStart + 5, tipEnd);

    const reasonStart = input.indexOf("<reason>", tipEnd);
    const reasonEnd = input.indexOf("</reason>", reasonStart);
    const reason = input.slice(reasonStart + 8, reasonEnd);

    tipReasonPairs.push({ tip, reason });

    // Move index forward to continue searching
    i = reasonEnd + 9;
  }

  return tipReasonPairs;
}

// // Example usage:
// const inputString = `
// 1. <tip>Phrase sentences in the format: (what you did, what impact it had)</tip>
//    <reason>This creates clarity and demonstrates the value of your actions.</reason>

// 2. <tip>Suggest alternatives to weak action verbs (like "used" or "worked")</tip>
//    <reason>Stronger verbs enhance the impression of your contributions.</reason>

// 3. <tip>Identify metrics that sound fake (e.g. "improved something 1000000x")</tip>
//    <reason>This avoids skepticism from reviewers about your claims.</reason>

// 4. <tip>Use contractions for more whitespace</tip>
//    <reason>Contractions lead to brevity and a more conversational tone.</reason>
// `;

// console.log(extractTipsAndReasons(inputString));
