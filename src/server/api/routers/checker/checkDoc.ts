import { type CheckerType } from "@/server/api/routers/checker/checker";
import { Llm2 } from "@/server/api/routers/checker/llm2";
import { extractTipsAndReasons } from "@/server/api/routers/checker/llmOutputHelpers";
import {
  inferenceInstructions,
  preprocessInstructions,
} from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { tinySimpleHash } from "@/utils/strings";
import { type PrismaClient } from "@prisma/client";
import path from "path";

export class CheckerWorker {
  systemPrompt = "";
  modelName = "gpt-3.5-turbo";
  llm: Llm2;
  db: PrismaClient;

  constructor(db: PrismaClient) {
    const cache = new SimpleCache(
      path.join(process.cwd(), ".chatgpt_history"),
      "/cache",
    );
    const apiKey = process.env.OPENAI_API_KEY;
    this.llm = new Llm2(this.systemPrompt, this.modelName, cache, apiKey);
    this.db = db;
  }

  updateRefinedPrompt = async (checker: Awaited<CheckerType>) => {
    const promptHash = tinySimpleHash(checker.prompt);
    if (checker.promptHashThatDerivedRefinedPrompt === promptHash) {
      return checker;
    }

    const refinedPrompt = await this.llm.prompt(
      preprocessInstructions(checker.prompt),
    );
    return await this.db.checker.update({
      where: {
        id: checker.id,
      },
      data: {
        refinedPrompt,
        promptHashThatDerivedRefinedPrompt: promptHash,
      },
    });
  };

  checkDoc = async (doc: string, checker: Awaited<CheckerType>) => {
    // TODO: do this elsewhere? it's hard though. I think it's fine. I'm just worried that 20 ppl will spam, and we're going to refine the prompt 20 times
    // this will be a problem to solve later
    const newChecker = await this.updateRefinedPrompt(checker);

    const tipsAndReasons = extractTipsAndReasons(newChecker.refinedPrompt);
    const res = await this.llm.prompt(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      inferenceInstructions(newChecker.refinedPrompt, doc),
    );
    console.log("res", res);

    // TODO: I need to parse it and turn it into suggestions

    // console.log("checkDoc", checker, doc);

    return {
      suggestions: [],
    };
  };
}
