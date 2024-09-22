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

export function removeAllDiffsOnEndsNotInTags(
  doc: string,
  editedDoc: string,
): string {
  // 1) just calculate the edit distance
  // 2) if there is an edit that is NOT part of a tag, remove it
  return "";
}
