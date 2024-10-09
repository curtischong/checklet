import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { mixpanel } from "@/mixpanel";

// regex to match <tip> tags that do NOT contain both <old> and <name> and <reason>
const regexFinal =
  /<tip>(?![\s\S]*?<old>[\s\S]*?<name>[\s\S]*?<reason>).*?<\/tip>/gs;

// Function to remove invalid <tip> tags
export function removeInvalidTips(text: string): string {
  return text.replace(regexFinal, "");
  // TODO: replace it with the capture group of the <old> text? I guess we can't be sure that it'll even have that
  // using doc3.replace(tipTagPattern, "$1") ????
}

export function removeInvalidSuggestions(suggestions: Suggestion[]) {
  const newSuggestions = [];
  for (const suggestion of suggestions) {
    if (suggestion.oldText === suggestion.newText) {
      suggestion.newText = undefined;
      newSuggestions.push(suggestion);
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
