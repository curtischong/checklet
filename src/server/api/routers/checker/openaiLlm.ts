import { Llm3 } from "@/server/api/routers/checker/llm3";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import path from "path";

const cache3 = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache3",
);
const apiKey = process.env.OPENAI_API_KEY;
export const openaiLlm = new Llm3("gpt-4o", "", cache3, apiKey);
