import { postprocessDoc } from "@/server/api/routers/checker/textAlignment";

// Example usage:
const doc1 = "sentence 1. This is a sentence that needs editing.";
const doc2 =
  "Irrelevant text. sentence 1. This isa <tip:1>sentence<old:1:new>line</tip:1> that needs editing. More irrelevant text.";

const result = postprocessDoc(doc1, doc2);
console.log(result);
