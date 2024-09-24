import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";

// Updated regex to match <tip> tags that do NOT contain both <old> and <new>
const regexFinal =
  /<tip\|[^|]+\|[^>]+>(?:(?!<old>.*?<\/old>).)*(?:(?!<new>.*?<\/new>).)*<\/tip>/gs;

// Function to remove invalid <tip> tags
export function removeInvalidTips(text: string): string {
  return text.replace(regexFinal, "");
}

export function removeInvalidSuggestions(suggestions: Suggestion[]) {
  return suggestions.filter((suggestion) => {
    return suggestion.oldText !== suggestion.newText;
  });
}
