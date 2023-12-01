import { Llm } from "@api/llm";
import {
    CheckBlueprint,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";

export class Check {
    private llm;

    constructor(private blueprint: CheckBlueprint) {
        const systemPrompt = this.getSystemPrompt();
        console.log("systemPrompt", systemPrompt);
        this.llm = new Llm(systemPrompt, "gpt-3.5-turbo-0613", false);
    }

    getSystemPrompt(): string {
        const positiveExamples = this.blueprint.positiveExamples
            .map(this.getPositiveCheckExamplePrompt)
            .join("\n");

        return `You are a text document fixer. When given text, follow these instructions. ${this.blueprint.instruction}

Do not repeat back the entire text. Only output the edited text plus a bit of context around the edit for context. Here are some positive examples of how you should change the original text into the edited text:

${positiveExamples}
`;
    }

    getPositiveCheckExamplePrompt(
        positiveExample: PositiveCheckExample,
    ): string {
        return `[Original Text]: ${positiveExample.originalText}\n[Edited Text]: ${positiveExample.editedText}`;
    }

    async checkDoc(doc: string): Promise<string> {
        console.log("calling function with doc: ", doc);
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
                            description: "The texts you found the issue in.",
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
                // TODO: what is this????
                fn: (d) => {
                    console.log("called function", d);
                    return d;
                },
            })
            .then(() => {})
            .catch(() => {});
        // return response.choices[0].message.content ?? "unknown result";
        return data;
    }
}
