import { checkDoc } from "@/server/api/routers/checker/checkDoc";
import { Llm2 } from "@/server/api/routers/checker/llm2";
import { preprocessInstructions } from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import path from "path";
import { rizzumePrompt, sample_resume_2019 } from "scripts/samples/rizzume";

const systemPrompt = "";
const smartModel = "gpt-4o";
const cheapModel = "gpt-4o-mini";

const cache = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache",
);
const apiKey = process.env.OPENAI_API_KEY;
const llm = new Llm2(systemPrompt, cache, apiKey);
// const llm = new AzureLlm(cache);

const refinedPrompt = await llm.prompt(
  preprocessInstructions(rizzumePrompt),
  cheapModel,
);

const suggestions = await checkDoc(
  llm,
  refinedPrompt,
  sample_resume_2019,
  smartModel,
  cheapModel,
);
console.log(suggestions);
