import { removeInvalidTips } from "@/server/api/routers/checker/docPostProcess";
import { Llm3 } from "@/server/api/routers/checker/llm3";
import { extractSuggestions } from "@/server/api/routers/checker/llmOutputHelpers";
import { regenPrompt1 } from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import path from "path";

const model = "gpt-4o";
const cache3 = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache3",
);

export const regenPrompt = async (
  oldText: string,
  newText: string,
  suggestionName: string,
  suggestionReason: string,
  oldDocWithContext: string,
) => {
  const apiKey = process.env.OPENAI_API_KEY;

  const llm = new Llm3(model, "", cache3, apiKey);

  const newChat = await llm.promptMessages(
    [],
    regenPrompt1(
      oldText,
      newText,
      suggestionName,
      suggestionReason,
      oldDocWithContext,
    ),
    model,
  );
  const newDoc = newChat.message.content!;

  const doc3 = removeInvalidTips(newDoc); // removes extraneous whitespace / removals the llm made

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};
