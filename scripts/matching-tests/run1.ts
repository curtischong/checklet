import { extractSuggestions } from "@/server/api/routers/checker/llmOutputHelpers";
import { doc1, doc3 } from "scripts/matching-tests/sleepovers";

const suggestions = extractSuggestions(doc1, doc3);
console.log(suggestions);
console.log("num sugg", suggestions.length);

// for some reason, removing invalid suggestions fails the test. I don't care rn, cause it's not what I'm testing
// console.log(removeInvalidSuggestions(suggestions));
