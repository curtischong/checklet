import { checkDoc3 } from "@/server/api/routers/checker/checkDoc";
import { Llm3 } from "@/server/api/routers/checker/llm3";
import { preprocessInstructions } from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import path from "path";
import { rizzumePrompt, sample_resume_2019 } from "scripts/samples/rizzume";

const systemPrompt = "";
const smartModel = "gpt-4o-mini";
const cheapModel = "gpt-4o-mini";

const cache = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache",
);
const apiKey = process.env.OPENAI_API_KEY;
// const llm = new Llm2(systemPrompt, cache, apiKey);
const llm = new Llm3(smartModel, systemPrompt, cache, apiKey);
// const llm = new Llm(systemPrompt, smartModel, cache, apiKey);
// const llm = new AzureLlm(cache);

// const refinedPrompt = await llm.prompt(preprocessInstructions(rizzumePrompt));
const refinedPrompt = await llm.prompt(
  preprocessInstructions(rizzumePrompt),
  smartModel,
);
console.log("refined prompt");

const suggestions = await checkDoc3(
  llm,
  refinedPrompt,
  sample_resume_2019,
  smartModel,
);
// const suggestions = await checkDoc1(llm, refinedPrompt, sample_resume_2019);
console.log(suggestions);
