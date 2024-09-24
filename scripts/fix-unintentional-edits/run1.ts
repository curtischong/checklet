import { Llm } from "@/server/api/routers/checker/llm";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import path from "path";
import { rawEditedDoc } from "scripts/fix-unintentional-edits/samples";
import { sample_resume_2019 } from "scripts/samples/rizzume";

const systemPrompt = "";
const smartModel = "gpt-4o-mini";

const apiKey = process.env.OPENAI_API_KEY;
// const llm = new Llm2(systemPrompt, cache, apiKey);
// const llm = new Llm3(smartModel, systemPrompt, cache, apiKey);
const cache1 = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache1",
);
const llm = new Llm(systemPrompt, smartModel, cache1, apiKey);

const fixPrompt = `Below are two documents. The I want you to merge the <tip> tags and their contents from the second document into the first.

Note: the second document contains edits (of doc1) OUTSIDE the tip tags. Do not migrate those over. I just want doc1 but with the tips ported over from doc2.

<Document 1>
${sample_resume_2019}
</Document 1>

<Document 2>
${rawEditedDoc}
</Document 2>`;

const res = await llm.prompt(fixPrompt);
console.log("res", res);
