import { extractSuggestions } from "@/server/api/routers/checker/llmOutputHelpers";
import { doc1, doc3 } from "scripts/matching-tests/nevedhaa-resume";

const suggestions = extractSuggestions(doc1, doc3);
console.log(suggestions);
console.log("num sugg", suggestions.length);

// we expect 4 suggestions to be parsed
