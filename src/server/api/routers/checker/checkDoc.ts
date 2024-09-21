import { type CheckerType } from "@/server/api/routers/checker/checker";
import { Llm } from "@/server/api/routers/checker/llm";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import path from "path";

export const checkDoc = async (doc: string, checker: Awaited<CheckerType>) => {
  const systemPrompt = "";
  const modelName = "gpt-3.5-turbo";
  const apiKey = process.env.OPENAI_API_KEY;

  const cache = new SimpleCache(
    path.join(process.cwd(), ".chatgpt_history"),
    "/cache",
  );
  const llm = new Llm(systemPrompt, modelName, cache, apiKey);
  const res = await llm.prompt("hello");
  console.log("res", res);

  // console.log("checkDoc", checker, doc);

  return {
    suggestions: [],
  };
};
