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
        this.llm = new Llm(systemPrompt, "gpt-3.5-turbo", true);
    }

    private getSystemPrompt(): string {
        switch (this.blueprint.checkType) {
            case CheckType.rephrase:
                return this.getRephraseSystemPrompt();
            case CheckType.highlight:
                return this.getHighlightSystemPrompt();
            default:
                throw new Error(
                    `Unknown check type when getting system prompt ${this.blueprint.checkType}`,
                );
        }
    }
    private getRephraseSystemPrompt(): string {
        const positiveExamples = this.blueprint.positiveExamples
            .map(this.getRephraseCheckExamplePrompt)
            .join("\n");

        return `You are a text document fixer. When given text, follow these instructions. ${this.blueprint.instruction}

Call the function that converts the orginal text to the edited text. Be concise. Only output the edited text. Here are some positive examples of how you should change the original text into the edited text:

${positiveExamples}
`;
    }

    private getHighlightSystemPrompt(): string {
        const positiveExamples = this.blueprint.positiveExamples
            .map(this.getHighlightCheckExamplePrompt)
            .join("\n");

        return `You are a text document highlighter. When given text, follow these instructions. ${this.blueprint.instruction}

Call the function that highlights the text you found. Here are some positive examples of how you should highlight the text:

${positiveExamples}
`;
    }

    private getRephraseCheckExamplePrompt(
        positiveExample: PositiveCheckExample,
    ): string {
        return `[Original Text]: ${positiveExample.originalText}\n[Edited Text]: ${positiveExample.editedText}`;
    }

    private getHighlightCheckExamplePrompt(
        positiveExample: PositiveCheckExample,
    ): string {
        return `[Highlight Text]: ${positiveExample.originalText}`;
    }

    async checkDoc(doc: string): Promise<Suggestion[]> {
        switch (this.blueprint.checkType) {
            case CheckType.rephrase:
                return await this.doRephraseCheck(doc);
            case CheckType.highlight:
                return await this.doHighlightCheck(doc);
            default:
                throw new Error(
                    `Unknown check type when checking doc ${this.blueprint.checkType}`,
                );
        }
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
                            originalTexts: {
                                type: "array",
                                description:
                                    "The texts you found the issue in.",
                                items: {
                                    type: "string",
                                },
                            },
                            editedTexts: {
                                type: "array",
                                description: "The fixed texts",
                                items: {
                                    type: "string",
                                },
                            },
                        },
                        required: ["originalTexts", "editedTexts"],
                    },
                })
                .then((args) => {
                    console.log("got result", args);
                    const argsObj = JSON.parse(args);
                    let startIdx = 0;

                    const suggestions: Suggestion[] = [];
                    for (let i = 0; i < argsObj.originalTexts.length; i++) {
                        if (argsObj.editedTexts.length - 1 < i) {
                            console.error("editedText is too short");
                            break;
                        }
                        const originalEx = argsObj.originalTexts[i];
                        const editedEx = argsObj.editedTexts[i];
                        if (originalEx === editedEx) {
                            // the model didn't change anything. just ignore it
                            console.log("originalEx === editedEx", originalEx);
                            continue;
                        }

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
                            checkId: this.blueprint.objInfo.id,
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

    private async doHighlightCheck(doc: string): Promise<Suggestion[]> {
        console.log("calling function with doc: ", doc);
        return new Promise<Suggestion[]>((resolve, _reject) => {
            this.llm
                .callFunction({
                    prompt: `Find the text to highlight:\n${doc}`,
                    functionName: "highlight_text",
                    functionDesc: "Accepts highlighted text",
                    functionParams: {
                        type: "object",
                        // https://community.openai.com/t/function-call-complex-arrays-as-parameters/295648/2
                        properties: {
                            highlightedTexts: {
                                type: "array",
                                description: "The highlighted texts",
                                items: {
                                    type: "string",
                                },
                            },
                        },
                        required: ["highlightedTexts"],
                    },
                })
                .then((args) => {
                    console.log("got result", args);
                    const argsObj = JSON.parse(args);
                    let startIdx = 0;

                    const suggestions: Suggestion[] = [];
                    for (let i = 0; i < argsObj.highlightedTexts.length; i++) {
                        const highlightedText = argsObj.highlightedTexts[i];

                        // this makes the loop O(n^2). there's probably a faster algorithm
                        const highlightedTextIdx = doc
                            .substring(startIdx)
                            .indexOf(highlightedText);

                        if (highlightedTextIdx === -1) {
                            // the model generated extra suggestions that exceed the length of the doc. just ignore them
                            console.error("originalText not found in doc");
                            break;
                        }
                        const originalTextIdxRelativeToDoc =
                            startIdx + highlightedTextIdx;

                        startIdx =
                            originalTextIdxRelativeToDoc +
                            highlightedText.length; // update the startIdx, so for the next example, we don't include this text in the search space

                        // now that we know where the original text is, we can create the suggestion
                        suggestions.push({
                            range: newDocRange(
                                originalTextIdxRelativeToDoc,
                                startIdx,
                            ),
                            originalText: highlightedText,
                            editOps: [],
                            checkId: this.blueprint.objInfo.id,
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
    }
}
