import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch5";
import { assert } from "console";

const assertEqual = (a: any, b: any) => {
  assert(a === b, `${a} !== ${b}`);
};

{
  const doc1 = "Backend Languages: C++, C, Golang, Python, Node.js, TypeScript";
  // const doc2 = "Python, Node.js,";
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
