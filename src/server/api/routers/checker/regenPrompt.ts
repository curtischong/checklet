import { Llm3 } from "@/server/api/routers/checker/llm3";
import { regenPrompt2 } from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { TRPCError } from "@trpc/server";
import path from "path";

const model = "gpt-4o";
const cache3 = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache3",
);

const regex = /<new>(.*?)<\/new>/g;

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
    regenPrompt2(
      oldText,
      newText,
      suggestionName,
      suggestionReason,
      oldDocWithContext,
    ),
    model,
  );
  const newDoc = newChat.message.content!;

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
