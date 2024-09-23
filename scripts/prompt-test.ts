import { checkDoc1dot10 } from "@/server/api/routers/checker/checkDoc";
import { Llm } from "@/server/api/routers/checker/llm";
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
// const llm = new Llm3(smartModel, systemPrompt, cache, apiKey);
const cache1 = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache1",
);
const llm = new Llm(systemPrompt, smartModel, cache1, apiKey);
// const llm = new AzureLlm(cache);

// const refinedPrompt = await llm.prompt(preprocessInstructions(rizzumePrompt));
// const refinedPrompt = await llm.prompt(
//   preprocessInstructions(rizzumePrompt),
//   // smartModel,
// );
// console.log("refined prompt", refinedPrompt);

// const feedbackResponse = await checkDoc1dot5(
//   llm,
//   refinedPrompt,
//   sample_resume_2019,
// );
// const feedbackResponse = await checkDoc1(
//   llm,
//   refinedPrompt,
//   sample_resume_2019,
// );
// const feedbackResponse = await checkDoc1dot7(
// const feedbackResponse = await checkDoc1dot8(
// const feedbackResponse = await checkDoc1dot9(
const feedbackResponse = await checkDoc1dot10(
  llm,
  rizzumePrompt,
  sample_resume_2019,
);
// const suggestions = await checkDoc2(
//   llm,
//   refinedPrompt,
//   sample_resume_2019,
//   smartModel,
//   cheapModel,
// );
// const suggestions = await checkDoc3(
//   llm,
//   refinedPrompt,
//   sample_resume_2019,
//   smartModel,
// );
console.log("FeedbackResponse", feedbackResponse);
