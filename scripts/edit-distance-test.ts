import { editDistanceOperationsWithClasses } from "@/server/api/routers/checker/editDistance";

console.log(editDistanceOperationsWithClasses("kitten", "sittinggg"));

// this edit distance operation makes sense. cause the edit of "least resistance" doesn't matter which path
// it took. it just matters that the edit distance is the shortest
console.log(
  editDistanceOperationsWithClasses(
    "hi my name is curtis",
    "<tip:2>hello</tip:> my name is curtis",
  ),
);

// however, I don't care about the edit distance. all I want is to find the <tip> tags
