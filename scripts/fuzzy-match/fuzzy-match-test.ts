// import { fuzzyMatchAroundIndex } from "@/server/api/routers/checker/fuzzyMatch3";
// import { fuzzyMatchAroundIndexWithRegex } from "@/server/api/routers/checker/fuzzyMatch3dot5";
import { matchQueryInDocument } from "@/server/api/routers/checker/matchQueryInDocument";
// import { fuzzyMatchAroundIndex } from "./run3";

const assertEqual = (a: any, b: any) => {
  if (a !== b) {
    console.log(`assertion failed, ${a} !== ${b}`);
  } else {
    console.log(`assertion passed, ${a}`);
  }
};

{
  console.log(
    "----------------test real text has more text (contains the 'C' lanaguage)",
  );
  const doc1 = "Backend Languages: C++, C, Golang, Python, Node.js, TypeScript";
  const _doc2 =
    "Backend Languages: C++, Golang, <tip|remove languages|we should rm these languages><old>Python, Node.js,</old><new></new></tip> TypeScript";

  const expectedIndex = 32;
  const { matchedSubstring, actualIndex } = matchQueryInDocument(
    doc1,
    "Python, Node.js,",
    expectedIndex,
  );

  assertEqual(matchedSubstring, "Python, Node.js,");
  assertEqual(actualIndex, 35);
}

{
  console.log("----------------test match with punctuation in text");
  const doc1 = "Backend Languages: C++, C, Golang, Python, Node.js, TypeScript";
  const _doc2 =
    "Backend Languages: C++, C, Golang<tip|remove languages|we should rm these languages><old>, Python, Node.js</old><new></new></tip>, TypeScript";

  const expectedIndex = 33;
  const { matchedSubstring, actualIndex } = matchQueryInDocument(
    doc1,
    ", Python, Node.js",
    expectedIndex,
  );

  assertEqual(matchedSubstring, ", Python, Node.js");
  assertEqual(actualIndex, 33);
}
{
  console.log("----------------test match with punctuation in text2");
  const doc1 =
    "Software Engineering Intern at Kik Interactive (Python, Docker, SQL) May - Aug. 2019";
  const _doc2 =
    "Software Engineering Intern at Kik Interactive (Python, Docker, SQL) May - Aug <tip|Consistent Abbreviation|It improves consistency in presentation><old>. 2019</old><new> 2019</new></tip>";

  const expectedIndex = 79;
  const { matchedSubstring, actualIndex } = matchQueryInDocument(
    doc1,
    ". 2019",
    expectedIndex,
  );

  assertEqual(matchedSubstring, ". 2019");
  assertEqual(actualIndex, 78);
}

{
  console.log(
    "----------------test the spacing we're matching is not exactly the same as in the original doc",
  );
  const doc1 = "graduation date: 2019 (expected)";
  const _doc2 =
    "graduation date: 2019 <tip|fix expected|we shold fix expected><old> (expected)</old><new>(exp.)</new></tip> ";

  const expectedIndex = 22;
  const { matchedSubstring, actualIndex } = matchQueryInDocument(
    doc1,
    " (expected)",
    expectedIndex,
  );

  assertEqual(matchedSubstring, " (expected)");
  assertEqual(actualIndex, 21);
}

{
  console.log(
    "----------------test when the original document has extra spaces than in the <old> tag, the fuzzymatch we return is the EXACT substring (includes spaces)",
  );
  const doc1 =
    "Data Science Workshop Lead at the STEM Fellowship     \t\t\t\t\t            Mar. 2017 - Present";

  const expectedIndex = 22;
  const { matchedSubstring, actualIndex } = matchQueryInDocument(
    doc1,
    "Data Science Workshop Lead at the STEM Fellowship Mar. 2017 - Present",
    expectedIndex,
  );

  assertEqual(
    matchedSubstring,
    "Data Science Workshop Lead at the STEM Fellowship     \t\t\t\t\t            Mar. 2017 - Present",
  );
  assertEqual(actualIndex, 0);
}

// {
//   console.log(
//     "----------------test the text we're matching had an extra word that is not in the original doc",
//   );
//   const doc1 =
//     "This is my graduation date: Honours Bachelor of Software Engineering Co-op | University of Waterloo | 2018 - 2023 (Expected)";
//   const _doc2 =
//     "This is my graduation date: <tip|fix expected|we shold fix expected><old>Honours Bachelor of Software Engineering Co-op | University of Waterloo | 2018 - 2023 (Expected)</old><new>Software Engineering Co-op | University of Waterloo | 2018 - 2023</new></tip>";

//   const expectedIndex = 22;
//   const { matchedSubstring, actualIndex } = fuzzyMatchAroundIndex(
//     doc1,
//     "Bachelor of Software Engineering Co-op | University of Waterloo | 2018 - 2023 (Expected)",
//     expectedIndex,
//   );

//   assertEqual(matchedSubstring, "(expected)");
//   assertEqual(actualIndex, 22);
// }
