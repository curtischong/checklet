import { editDistanceOperationsWithClasses } from "@/server/api/routers/checker/editDistance";

// this edit distance operation makes sense. cause the edit of "least resistance" doesn't matter which path
// it took. it just matters that the edit distance is the shortest
console.log(
  editDistanceOperationsWithClasses(
    "hi my name is curtis",
    "<tip:2>hello</tip:> my name is curtis",
  ),
);
console.log(
  editDistanceOperationsWithClasses("hi my name is curtis", "hi my is curtis"),
);

// however, I don't care about the edit distance. all I want is to find the <tip> tags

// the start/end is bad. it's not: "insert these chars in the roiginal one. it's: "on the edited text, here's what it should be"
