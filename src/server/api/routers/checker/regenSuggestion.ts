import { openaiLlm } from "@/server/api/routers/checker/openaiLlm";
import { regenPrompt3 } from "@/server/api/routers/checker/prompts";
import { TRPCError } from "@trpc/server";

// const model = "gpt-4o";
// const cache3 = new SimpleCache(
//   path.join(process.cwd(), ".chatgpt_history"),
//   "/cache3",
// );

const regex = /<new2>(.*?)<\/new2>/g;

export const regenSuggestion = async (
  oldText: string,
  newText: string | undefined,
  suggestionName: string,
  suggestionReason: string,
  oldDocWithContext: string,
  regeneratePrompt: string,
) => {
  if (newText === undefined) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `failed to regenerate suggestion. We do not support regenerating suggestions without a newText`,
    });
  }
  // const apiKey = process.env.OPENAI_API_KEY;

  // const llm = new Llm3(model, "", cache3, apiKey);

  const newChat = await openaiLlm.promptMessages(
    [],
    regenPrompt3(
      oldText,
      newText,
      suggestionName,
      suggestionReason,
      oldDocWithContext,
      regeneratePrompt,
    ),
    openaiLlm.model,
  );
  const newDoc = newChat.message.content!;
  console.log("newdoc-------------");
  console.log(newDoc);

  const matches = [];
  let match;

  while ((match = regex.exec(newDoc)) !== null) {
    matches.push(match[1]);
  }
  if (matches.length === 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `failed to regenerate suggestion`,
    });
  }

  return matches[matches.length - 1];
};
