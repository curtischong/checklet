import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { mixpanel } from "@/mixpanel";

// Updated regex to match <tip> tags that do NOT contain both <old> and <new>
const regexFinal =
  /<tip\|[^|]+\|[^>]+>(?:(?!<old>.*?<\/old>).)*(?:(?!<new>.*?<\/new>).)*<\/tip>/gs;

// Function to remove invalid <tip> tags
export function removeInvalidTips(text: string): string {
  return text.replace(regexFinal, "");
}

export function removeInvalidSuggestions(suggestions: Suggestion[]) {
  const newSuggestions = [];
  for (const suggestion of suggestions) {
    if (suggestion.oldText === suggestion.newText) {
      continue;
    }
    if (suggestion.range.start === -1) {
      mixpanel.track("Failed to Find Suggestion in doc", {
        suggestion: suggestion,
      });
      continue;
    }
    newSuggestions.push(suggestion);
  }
  return newSuggestions;
}
