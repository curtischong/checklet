import { Llm } from "@/server/api/routers/checker/llm";
import { preprocessInstructions } from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import path from "path";
import { rizzumePrompt } from "scripts/samples/rizzume";

const systemPrompt = "";
const modelName = "gpt-4o-mini";

const cache = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache",
);
const apiKey = process.env.OPENAI_API_KEY;
const llm = new Llm(systemPrompt, modelName, cache, apiKey);

const res = await llm.prompt(preprocessInstructions(rizzumePrompt));
console.log(res);
