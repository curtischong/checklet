import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch3";

const assertEqual = (a: any, b: any) => {
  if (a !== b) {
    console.log(`assertion failed, ${a} !== ${b}`);
  } else {
    console.log(`assertion passed, ${a}`);
  }
};

{
  console.log("test real text has more text (contains the 'C' lanaguage)");
  const doc1 = "Backend Languages: C++, C, Golang, Python, Node.js, TypeScript";
  const _doc2 =
    "Backend Languages: C++, Golang, <tip|remove languages|we should rm these languages><old>Python,</old><new></new></tip>Node.js, TypeScript";

  const expectedIndex = 32;
  const { matchedSubstring, actualIndex } = fuzzyMatchAroundIndex(
    doc1,
    ", Python, Node.js",
    expectedIndex,
  );

  assertEqual(matchedSubstring, "Python,");
  assertEqual(actualIndex, 35);
}

{
  console.log("test match with punctuation in text");
  const doc1 = "Backend Languages: C++, C, Golang, Python, Node.js, TypeScript";
  const _doc2 =
    "Backend Languages: C++, C, Golang<tip|remove languages|we should rm these languages><old>, Python, Node.js</old><new></new></tip>, TypeScript";

  const expectedIndex = 33;
  const { matchedSubstring, actualIndex } = fuzzyMatchAroundIndex(
    doc1,
    ", Python, Node.js",
    expectedIndex,
  );

  assertEqual(matchedSubstring, ", Python, Node.js");
  assertEqual(actualIndex, 33);
}
