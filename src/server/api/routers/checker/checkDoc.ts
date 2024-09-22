import { type Suggestion } from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { type CheckerType } from "@/server/api/routers/checker/checker";
import { editDistanceOperationsWithClasses } from "@/server/api/routers/checker/editDistance";
import { Llm2 } from "@/server/api/routers/checker/llm2";
import { type Llm3 } from "@/server/api/routers/checker/llm3";
import { extractTipsAndReasons } from "@/server/api/routers/checker/llmOutputHelpers";
import {
  inferenceInstructions1,
  inferenceInstructions2,
  preprocessInstructions,
} from "@/server/api/routers/checker/prompts";
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { tinySimpleHash } from "@/utils/strings";
import { type PrismaClient } from "@prisma/client";
import { type ChatCompletionTool } from "openai/resources/index.mjs";
import path from "path";

export class CheckerWorker {
  systemPrompt = "";
  smartModel = "gpt-4o-mini";
  cheapModel = "gpt-4o-mini";
  llm: Llm2;
  db: PrismaClient;

  constructor(db: PrismaClient) {
    const cache = new SimpleCache(
      path.join(process.cwd(), ".chatgpt_history"),
      "/cache",
    );
    const apiKey = process.env.OPENAI_API_KEY;
    this.llm = new Llm2(this.systemPrompt, cache, apiKey);
    this.db = db;
  }

  updateRefinedPrompt = async (checker: Awaited<CheckerType>) => {
    const promptHash = tinySimpleHash(checker.prompt);
    if (checker.promptHashThatDerivedRefinedPrompt === promptHash) {
      return checker;
    }

    const refinedPrompt = await this.llm.prompt(
      preprocessInstructions(checker.prompt),
      this.cheapModel,
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

    const suggestions = await checkDoc(
      this.llm,
      newChecker.refinedPrompt,
      doc,
      this.smartModel,
      this.cheapModel,
    );
    console.log("suggestions", suggestions);
    // TODO: I need to parse it and turn it into suggestions

    // console.log("checkDoc", checker, doc);

    return {
      suggestions: [],
    };
  };
}

// export const checkDoc1 = async (
//   llm: Llm,
//   refinedPrompt: string,
//   doc: string,
// ): Promise<Suggestion[]> => {
//   const newDoc = await llm.prompt(inferenceInstructions(refinedPrompt, doc));
//   const tipsAndReasons = extractTipsAndReasons(refinedPrompt);

//   const edits = editDistanceOperationsWithClasses(doc, newDoc);
//   edits.sort((a, b) => {
//     return a.range.start - b.range.start;
//   });
//   console.log("newDoc", newDoc);
//   console.log("edits", edits);

//   // console.log("newDoc", newDoc);
//   // console.log(tipsAndReasons);

//   // TODO: I need to parse it and turn it into suggestions

//   // console.log("checkDoc", checker, doc);

//   return [];
// };

export const checkDoc = async (
  llm: Llm2,
  refinedPrompt: string,
  doc: string,
  smartModel: string,
  cheapModel: string,
): Promise<Suggestion[]> => {
  const editsChain = await llm.promptMessagesExtendChain(
    [],
    inferenceInstructions1(refinedPrompt, doc),
    smartModel,
  );
  console.log("editsChain done", editsChain);
  const newChat = await llm.promptMessages(
    editsChain,
    inferenceInstructions2(doc),
    cheapModel,
  );
  const newDoc = newChat.message.content!;
  const tipsAndReasons = extractTipsAndReasons(refinedPrompt);

  const edits = editDistanceOperationsWithClasses(doc, newDoc);
  console.log("newDoc", newDoc);
  console.log("edits", edits);

  // console.log("newDoc", newDoc);
  // console.log(tipsAndReasons);

  // TODO: I need to parse it and turn it into suggestions

  // console.log("checkDoc", checker, doc);

  return [];
};

export const checkDoc3 = async (
  llm: Llm3,
  refinedPrompt: string,
  doc: string,
  smartModel: string,
): Promise<Suggestion[]> => {
  const editsChain = await llm.promptMessagesExtendChain(
    [],
    inferenceInstructions1(refinedPrompt, doc),
    smartModel,
  );
  console.log("editsChain done", editsChain);

  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "submit_edited_doc",
        description:
          "Submit the edited doc with the edits annotated with <tip:#>your edit</tip:#> tags",
        parameters: {
          type: "object",
          properties: {
            editedDoc: {
              type: "string",
              description: "The edited document with the annotations",
            },
          },
          required: ["editedDoc"],
        },
      },
    },
  ];
  const newDoc = await llm.callFunction(
    editsChain,
    inferenceInstructions2(doc),
    tools,
  );

  const tipsAndReasons = extractTipsAndReasons(refinedPrompt);
  const edits = editDistanceOperationsWithClasses(doc, newDoc);
  console.log("newDoc", newDoc);
  console.log("edits", edits);
  return [];
};
