import { extractSuggestions } from "@/server/api/routers/checker/llmOutputHelpers";
import { doc1, doc3 } from "scripts/matching-tests/sleepovers";

const suggestions = extractSuggestions(doc1, doc3);
console.log(suggestions);
console.log("num sugg", suggestions.length);

// the match we're looking for is "We can use" at index 687 (in doc1)

// for some reason, removing invalid suggestions fails the test. I don't care rn, cause it's not what I'm testing
// console.log(removeInvalidSuggestions(suggestions));
