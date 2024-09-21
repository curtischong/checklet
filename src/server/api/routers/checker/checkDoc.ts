import { type CheckerType } from "@/server/api/routers/checker/checker";
import { Llm } from "@/server/api/routers/checker/llm";
import {
  inferenceInstructions,
  preprocessInstructions,
} from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { tinySimpleHash } from "@/utils/strings";
import { type PrismaClient } from "@prisma/client";
import path from "path";

export class Checker {
  systemPrompt = "";
  modelName = "gpt-3.5-turbo";
  llm: Llm;
  db: PrismaClient;

  constructor(db: PrismaClient) {
    const cache = new SimpleCache(
      path.join(process.cwd(), ".chatgpt_history"),
      "/cache",
    );
    const apiKey = process.env.OPENAI_API_KEY;
    this.llm = new Llm(this.systemPrompt, this.modelName, cache, apiKey);
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
    const newChecker = await this.updateRefinedPrompt(checker);
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
