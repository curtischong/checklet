import { Suggestion, newDocRange } from "@api/ApiTypes";
import { editDistanceOperationsWithClasses } from "@api/editDistance";
import { Llm } from "@api/llm";
import {
    CheckBlueprint,
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { createUniqueId } from "@utils/strings";

export class Check {
    private llm;

    constructor(public blueprint: CheckBlueprint) {
        const systemPrompt = this.getSystemPrompt();
        console.log("systemPrompt", systemPrompt);
        this.llm = new Llm(systemPrompt, "gpt-3.5-turbo-0613", true);
    }

    private getSystemPrompt(): string {
        const positiveExamples = this.blueprint.positiveExamples
            .map(this.getPositiveCheckExamplePrompt)
            .join("\n");

        return `You are a text document fixer. When given text, follow these instructions. ${this.blueprint.instruction}

Do not repeat back the entire text. Only output the edited text plus a bit of context around the edit for context. Here are some positive examples of how you should change the original text into the edited text:

${positiveExamples}
`;
    }

    private getPositiveCheckExamplePrompt(
        positiveExample: PositiveCheckExample,
    ): string {
        return `[Original Text]: ${positiveExample.originalText}\n[Edited Text]: ${positiveExample.editedText}`;
    }

    async checkDoc(doc: string): Promise<Suggestion[]> {
        return await this.doRephraseCheck(doc);
    }
    private async doRephraseCheck(doc: string): Promise<Suggestion[]> {
        console.log("calling function with doc: ", doc);
        return new Promise<Suggestion[]>((resolve, _reject) => {
            this.llm
                .callFunction({
                    prompt: `Fix this text:\n${doc}`,
                    functionName: "fix_text",
                    functionDesc:
                        "Applies the change on the original text to get the edited text.",
                    functionParams: {
                        type: "object",
                        // https://community.openai.com/t/function-call-complex-arrays-as-parameters/295648/2
                        properties: {
                            originalText: {
                                type: "array",
                                description:
                                    "The texts you found the issue in.",
                                items: {
                                    type: "string",
                                },
                            },
                            editedText: {
                                type: "array",
                                description: "The fixed texts",
                                items: {
                                    type: "string",
                                },
                            },
                        },
                        required: ["originalText", "editedText"],
                    },
                })
                .then((args) => {
                    console.log("got result", args);
                    const argsObj = JSON.parse(args);
                    let startIdx = 0;

                    const suggestions: Suggestion[] = [];
                    for (let i = 0; i < argsObj.originalText.length; i++) {
                        if (argsObj.editedText.length - 1 < i) {
                            console.error("editedText is too short");
                            break;
                        }
                        const originalEx = argsObj.originalText[i];
                        const editedEx = argsObj.editedText[i];

                        const editOps = editDistanceOperationsWithClasses(
                            originalEx,
                            editedEx,
                        );

                        const originalTextIdx = doc
                            .substring(startIdx)
                            .indexOf(originalEx);

                        if (originalTextIdx === -1) {
                            // the model generated extra suggestions that exceed the length of the doc. just ignore them
                            console.error("originalText not found in doc");
                            break;
                        }
                        const originalTextIdxRelativeToDoc =
                            startIdx + originalTextIdx;

                        startIdx =
                            originalTextIdxRelativeToDoc + originalEx.length; // update the startIdx, so for the next example, we don't include this text in the search space

                        // now that we know where the original text is, we can create the suggestion
                        suggestions.push({
                            range: newDocRange(
                                originalTextIdxRelativeToDoc,
                                startIdx,
                            ),
                            originalText: originalEx,
                            editedText: editedEx,
                            editOps,
                            checkId: this.blueprint.checkId,
                            suggestionId: createUniqueId(),
                        });
                    }
                    resolve(suggestions);
                })
                .catch((err) => {
                    // the function call errored out. it's ok, just return no suggestions
                    console.error(`function call failed. err=${err}`);
                    resolve([]);
                });
        });
        // return response.choices[0].message.content ?? "unknown result";
    }
}
