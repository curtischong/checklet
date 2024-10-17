import {
  type FeedbackResponse,
  type Suggestion,
} from "@/app/checker/[checkerId]/editor/suggestions/suggestionsTypes";
import { mixpanel } from "@/mixpanel";
import {
  azureLlmClient,
  type AzureLlm,
} from "@/server/api/routers/checker/azureLlm";
import { type GetCheckerByIdStrictType } from "@/server/api/routers/checker/checker";
import {
  removeInvalidSuggestions,
  removeInvalidTips,
} from "@/server/api/routers/checker/docPostProcess";
import { editDistanceOperationsWithClasses } from "@/server/api/routers/checker/editDistance";
import { type Llm } from "@/server/api/routers/checker/llm";
import { type Llm2 } from "@/server/api/routers/checker/llm2";
import { type Llm3 } from "@/server/api/routers/checker/llm3";
import {
  extractSuggestions,
  extractTips,
} from "@/server/api/routers/checker/llmOutputHelpers";
import {
  addTipTags4,
  addTipTags4Dot1,
  addTipTags4Dot2,
  addTipTags4Dot3,
  addTipTags4Dot4,
  addTipTags4Dot6,
  addTipTags4Dot7,
  addTipTags4Dot8,
  addTipTags4Dot9,
  inference6,
  inference6Dot2,
  inference6Dot3,
  inferenceInstructions,
  inferenceInstructions1,
  inferenceInstructions1dot11,
  inferenceInstructions1dot14,
  inferenceInstructions1dot15,
  inferenceInstructions1dot5,
  inferenceInstructions1dot6,
  inferenceInstructions1dot7,
  inferenceInstructions1dot8,
  inferenceInstructions2,
  inferenceInstructions4,
  mergeDoc2TipsIntoDoc1,
  mergeDoc2TipsIntoDoc1Dot2,
  oneshot5dot1,
} from "@/server/api/routers/checker/prompts";
import { postprocessDoc } from "@/server/api/routers/checker/textAlignment";
import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  type ChatCompletionMessageParam,
  type ChatCompletionTool,
} from "openai/resources/index.mjs";

export class CheckerWorker {
  systemPrompt = "";
  smartModel = "gpt-4o";
  cheapModel = "gpt-4o";
  // llm: Llm;
  // llm3: Llm3;
  db: PrismaClient;

  constructor(db: PrismaClient) {
    // const cache = new SimpleCache(
    //   path.join(process.cwd(), ".chatgpt_history"),
    //   "/cache",
    // );
    // const apiKey = process.env.OPENAI_API_KEY;
    // this.llm = new Llm(this.systemPrompt, this.smartModel, cache, apiKey);
    // const cache3 = new SimpleCache(
    //   path.join(process.cwd(), ".chatgpt_history"),
    //   "/cache3",
    // );
    // this.llm3 = new Llm3(this.smartModel, this.systemPrompt, cache3, apiKey);
    this.db = db;
  }

  // updateRefinedPrompt = async (checker: GetCheckerByIdType) => {
  //   const promptHash = tinySimpleHash(checker.prompt);
  //   if (checker.promptHashThatDerivedRefinedPrompt === promptHash) {
  //     return checker;
  //   }

  //   const refinedPrompt = await this.llm.prompt(
  //     preprocessInstructions(checker.prompt),
  //   );
  //   return await this.db.checker.update({
  //     where: {
  //       id: checker.id,
  //     },
  //     data: {
  //       refinedPrompt,
  //       promptHashThatDerivedRefinedPrompt: promptHash,
  //     },
  //   });
  // };

  checkDoc = async (doc: string, checker: GetCheckerByIdStrictType) => {
    // TODO: do this elsewhere? it's hard though. I think it's fine. I'm just worried that 20 ppl will spam, and we're going to refine the prompt 20 times
    // this will be a problem to solve later
    // const newChecker = await this.updateRefinedPrompt(checker);

    // const suggestions = await checkDoc1dot14(this.llm3, newChecker.prompt, doc);
    // const suggestions = await checkDoc4Dot3(this.llm3, checker.prompt, doc);
    // const suggestions = await checkDoc5Dot1(this.llm3, checker.prompt, doc);
    // const suggestions = await checkDoc4Dot6(openaiLlm, checker.prompt, doc);
    // const suggestions = await checkDoc4Dot7(openaiLlm, checker.prompt, doc);
    // const suggestions = await checkDoc4Dot10(openaiLlm, checker.prompt, doc);

    let res;
    try {
      res = await checkDoc4Dot11(azureLlmClient, checker.prompt, doc);
    } catch (err) {
      console.error("checkDoc error", err);
      // console.error("doc", doc);
      const errMsg = err instanceof Error ? err.message : String(err);
      mixpanel.track("checkDocError", {
        doc: doc,
        checkerId: checker.id,
        prompt: checker.prompt,
        error: errMsg,
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while checking the doc. err=${errMsg}`,
      });
    }

    const { suggestions, doc2PlusChainOfThought, doc3 } = res;
    // console.log("suggestions", suggestions);
    mixpanel.track("checkDoc", {
      checkerName: checker.name,
      checkerId: checker.id,
      // prompt: checker.prompt,
      // PERF: remove this train of though later?
      doc2PlusChainOfThought: doc2PlusChainOfThought.length,
      doc3: doc3.length,
      suggestions: suggestions.length,
    });

    return {
      suggestions: suggestions,
    };
  };
}

export const checkDoc1dot5 = async (
  llm: Llm,
  refinedPrompt: string,
  doc: string,
): Promise<FeedbackResponse> => {
  const rawEditedDoc = await llm.prompt(
    inferenceInstructions1dot5(refinedPrompt, doc),
  );
  console.log("rawEditedDoc", rawEditedDoc);
  const tips = extractTips(refinedPrompt);

  const docWithOnlyEdits = postprocessDoc(doc, rawEditedDoc); // removes extraneous whitespace / removals the llm made
  // console.log("docWithOnlyEdits", docWithOnlyEdits);
  const suggestions = extractSuggestions(doc, docWithOnlyEdits);

  return {
    tips: tips,
    suggestions: suggestions,
  };
};

export const checkDoc1dot6 = async (
  llm: Llm,
  refinedPrompt: string,
  doc: string,
): Promise<FeedbackResponse> => {
  const rawEditedDoc = await llm.prompt(
    inferenceInstructions1dot6(refinedPrompt, doc),
  );
  console.log("rawEditedDoc", rawEditedDoc);
  const tips = extractTips(refinedPrompt);

  const docWithOnlyEdits = postprocessDoc(doc, rawEditedDoc); // removes extraneous whitespace / removals the llm made
  // console.log("docWithOnlyEdits", docWithOnlyEdits);
  const suggestions = extractSuggestions(doc, docWithOnlyEdits);

  return {
    tips: tips,
    suggestions: suggestions,
  };
};

export const checkDoc1dot7 = async (
  llm: Llm,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const rawEditedDoc = await llm.prompt(
    inferenceInstructions1dot7(prompt, doc),
  );
  console.log("rawEditedDoc", rawEditedDoc);
  // const tips = extractTips(prompt);

  const docWithOnlyEdits = postprocessDoc(doc, rawEditedDoc); // removes extraneous whitespace / removals the llm made
  // console.log("docWithOnlyEdits", docWithOnlyEdits);
  const suggestions = extractSuggestions(doc, docWithOnlyEdits);

  return suggestions;
};

export const checkDoc1dot8 = async (
  llm: Llm,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const rawEditedDoc = await llm.prompt(
    inferenceInstructions1dot8(prompt, doc),
  );
  console.log("rawEditedDoc", rawEditedDoc);
  // const tips = extractTips(prompt);

  const docWithOnlyEdits = postprocessDoc(doc, rawEditedDoc); // removes extraneous whitespace / removals the llm made
  console.log("docWithOnlyEdits", docWithOnlyEdits);
  const suggestions = extractSuggestions(doc, docWithOnlyEdits);

  return suggestions;
};

export const checkDoc1dot9 = async (
  llm: Llm,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const rawEditedDoc = await llm.prompt(
    inferenceInstructions1dot8(prompt, doc),
  );
  console.log("rawEditedDoc", rawEditedDoc);

  const prunedEdits = removeInvalidTips(rawEditedDoc); // removes extraneous whitespace / removals the llm made
  console.log("prunedEdits", prunedEdits);
  const suggestions = extractSuggestions(doc, prunedEdits);

  return suggestions;
};

export const checkDoc1dot10 = async (
  llm: Llm,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const rawEditedDoc = await llm.prompt(
    inferenceInstructions1dot8(prompt, doc),
  );
  // console.log("rawEditedDoc", rawEditedDoc);

  const prunedEdits = removeInvalidTips(rawEditedDoc); // removes extraneous whitespace / removals the llm made
  console.log("prunedEdits", prunedEdits);

  // const docWithOnlyEdits = postprocessDoc(doc, prunedEdits); // removes extraneous whitespace / removals the llm made
  // console.log("docWithOnlyEdits", docWithOnlyEdits);

  const suggestions = extractSuggestions(doc, prunedEdits);

  return suggestions;
};

export const checkDoc1dot11 = async (
  llm: Llm,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const rawEditedResponse = await llm.prompt(
    inferenceInstructions1dot11(prompt, doc),
  );

  console.log("rawEditedResponse", rawEditedResponse);
  const onlyDoc = rawEditedResponse.split("<Doc Start>")[1]!;

  // const onlyDoc = await llm.prompt(fetchDoc(rawEditedResponse));
  // console.log("onlyDoc", onlyDoc);

  const doc2 = removeInvalidTips(onlyDoc); // removes extraneous whitespace / removals the llm made
  // console.log("prunedEdits", doc2);

  const doc3 = await llm.prompt(mergeDoc2TipsIntoDoc1(doc, doc2));

  console.log("doc3", doc3);

  // const docWithOnlyEdits = postprocessDoc(doc, prunedEdits); // removes extraneous whitespace / removals the llm made
  // console.log("docWithOnlyEdits", docWithOnlyEdits);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc1dot14 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inferenceInstructions1dot15(prompt, doc),
    llm.model,
  );
  console.log(
    "modelRes-----------------------------",
    chain[1]!.content as string,
  );
  const onlyDocMessages = await llm.promptMessagesExtendChain(
    chain,
    inferenceInstructions1dot14(),
    llm.model,
  );
  const onlyDoc = onlyDocMessages[onlyDocMessages.length - 1]!
    .content as string;
  console.log("onlyDoc------------------------------", onlyDoc);

  const doc2 = removeInvalidTips(onlyDoc); // removes extraneous whitespace / removals the llm made
  // console.log("prunedEdits", doc2);

  const doc3 = await llm.prompt(
    mergeDoc2TipsIntoDoc1Dot2(doc, doc2),
    llm.model,
  );

  console.log("doc3---------------------------------", doc3);

  // const docWithOnlyEdits = postprocessDoc(doc, prunedEdits); // removes extraneous whitespace / removals the llm made
  // console.log("docWithOnlyEdits", docWithOnlyEdits);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc1 = async (
  llm: Llm,
  refinedPrompt: string,
  doc: string,
): Promise<FeedbackResponse> => {
  const rawEditedDoc = await llm.prompt(
    inferenceInstructions(refinedPrompt, doc),
  );
  console.log("rawEditedDoc", rawEditedDoc);
  const tips = extractTips(refinedPrompt);

  const docWithOnlyEdits = postprocessDoc(doc, rawEditedDoc); // removes extraneous whitespace / removals the llm made
  // console.log("docWithOnlyEdits", docWithOnlyEdits);
  const suggestions = extractSuggestions(doc, docWithOnlyEdits);

  return {
    tips: tips,
    suggestions: suggestions,
  };
};

export const checkDoc2 = async (
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
  console.log("refinedPrompt", refinedPrompt);
  console.log("editsChain done", editsChain[editsChain.length - 1]?.content);
  const newChat = await llm.promptMessages(
    editsChain,
    inferenceInstructions2(doc),
    cheapModel,
  );
  const newDoc = newChat.message.content!;
  // const tipsAndReasons = extractTips(refinedPrompt);

  // getDocEdits(doc, newDoc);

  console.log("newDoc", newDoc);
  // console.log("edits", edits);

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

  // const tipsAndReasons = extractTips(refinedPrompt);
  const edits = editDistanceOperationsWithClasses(doc, newDoc);
  console.log("newDoc", newDoc);
  console.log("edits", edits);
  return [];
};

// checkdoc 4 series is about retroactively adding the tags
export const checkDoc4 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inferenceInstructions4(prompt, doc),
    llm.model,
  );
  const doc2PlusChainOfThought = chain[chain.length - 1]!.content as string;
  console.log("doc2PlusChainOfThought", doc2PlusChainOfThought);
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain, // TODO: wait. I am putting THE ENTIRE CHAIN HERE???
    addTipTags4(doc, doc2PlusChainOfThought),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot1 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inferenceInstructions4(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot1(doc),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot2 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inferenceInstructions4(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot2(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot3 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inferenceInstructions4(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot3(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot4 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inference6(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot4(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot6 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inference6(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot6(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot7 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inference6Dot2(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot7(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot8 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inference6(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot8(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot9 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inference6Dot3(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot8(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot10 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inference6Dot3(prompt, doc),
    llm.model,
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot9(),
    llm.model,
  );
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};

export const checkDoc4Dot11 = async (
  llm: AzureLlm,
  prompt: string,
  doc: string,
) => {
  const chain = await llm.promptMessagesExtendChain(
    [],
    inference6Dot3(prompt, doc),
  );
  console.log(
    "doc2PlusChainOfThought---------------------------",
    chain[chain.length - 1]!.content,
  );
  const doc2PlusChainOfThought = chain[chain.length - 1]!.content as string;
  const rawDoc3 = await llm.promptMessagesExtendChain(chain, addTipTags4Dot9());
  const rawDoc3Content = rawDoc3[rawDoc3.length - 1]!.content as string;

  if (rawDoc3Content === "I'm sorry, I can't assist with that request.") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `ChatGPT's moderation declined the request. Maybe reword it slightly?`,
    });
  }
  const doc3 = removeInvalidTips(rawDoc3Content); // removes extraneous whitespace / removals the llm made
  // console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return {
    suggestions: removeInvalidSuggestions(suggestions),
    doc2PlusChainOfThought,
    doc3,
  };
};

export const checkDoc4Dot12 = async (
  llm: AzureLlm,
  prompt: string,
  doc: string,
  thoughtProcess: string,
) => {
  const chain: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: inference6Dot3(prompt, doc),
    },
    {
      role: "assistant",
      content: thoughtProcess,
    },
  ];
  let rawDoc3 = await llm.promptMessagesExtendChain(chain, addTipTags4Dot9());
  let rawDoc3Content = rawDoc3[rawDoc3.length - 1]!.content as string;

  if (rawDoc3Content.startsWith("I'm sorry, I ")) {
    console.log("moderation flagged. retrying.");
    // retry
    rawDoc3 = await llm.promptMessagesExtendChain(
      rawDoc3,
      "Are you sure? I'm merely asking you to perform the edits. I'm not asking you to do anything malicious!",
    );
    rawDoc3Content = rawDoc3[rawDoc3.length - 1]!.content as string;

    if (rawDoc3Content.startsWith("I'm sorry, I ")) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `ChatGPT's moderation declined the request. Maybe reword it slightly?`,
      });
    }
  }
  const doc3 = removeInvalidTips(rawDoc3Content); // removes extraneous whitespace / removals the llm made

  const suggestions = extractSuggestions(doc, doc3);
  if (suggestions.length === 0) {
    console.log("no suggestions found. rawDoc3 is", rawDoc3Content);
  }

  return {
    suggestions: removeInvalidSuggestions(suggestions),
    doc2PlusChainOfThought: thoughtProcess,
    doc3,
  };
};

export const checkDoc4Dot12OpenAi = async (
  llm: Llm3,
  prompt: string,
  doc: string,
  thoughtProcess: string,
) => {
  const chain: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: inference6Dot3(prompt, doc),
    },
    {
      role: "assistant",
      content: thoughtProcess,
    },
  ];
  let rawDoc3 = await llm.promptMessagesExtendChain(
    chain,
    addTipTags4Dot9(),
    llm.model,
  );
  let rawDoc3Content = rawDoc3[rawDoc3.length - 1]!.content as string;

  if (rawDoc3Content.startsWith("I'm sorry, I ")) {
    console.log("moderation flagged. retrying.");
    // retry
    rawDoc3 = await llm.promptMessagesExtendChain(
      rawDoc3,
      "Are you sure? I'm merely asking you to perform the edits. I'm not asking you to do anything malicious!",
      llm.model,
    );
    rawDoc3Content = rawDoc3[rawDoc3.length - 1]!.content as string;

    if (rawDoc3Content.startsWith("I'm sorry, I ")) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `ChatGPT's moderation declined the request. Maybe reword it slightly?`,
      });
    }
  }
  const doc3 = removeInvalidTips(rawDoc3Content); // removes extraneous whitespace / removals the llm made

  const suggestions = extractSuggestions(doc, doc3);
  if (suggestions.length === 0) {
    console.log("no suggestions found. rawDoc3 is", rawDoc3Content);
  }

  return {
    suggestions: removeInvalidSuggestions(suggestions),
    doc2PlusChainOfThought: thoughtProcess,
    doc3,
  };
};

export const checkDoc5Dot1 = async (
  llm: Llm3,
  prompt: string,
  doc: string,
): Promise<Suggestion[]> => {
  const rawDoc3 = await llm.promptMessagesExtendChain(
    [],
    oneshot5dot1(prompt, doc),
    llm.model,
  );
  console.log("rawdoc3-----------------", rawDoc3[rawDoc3.length - 1]!.content);
  const doc3 = removeInvalidTips(
    rawDoc3[rawDoc3.length - 1]!.content as string,
  ); // removes extraneous whitespace / removals the llm made
  console.log("doc3---------------------------------", doc3);

  const suggestions = extractSuggestions(doc, doc3);

  return removeInvalidSuggestions(suggestions);
};
