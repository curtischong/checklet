import { Llm } from "@api/llm";
import {
    CheckBlueprint,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";

export class Check {
    private llm;

    constructor(private blueprint: CheckBlueprint) {
        this.llm = new Llm(this.getSystemPrompt(), "gpt-3.5-turbo", true);
    }

    getSystemPrompt(): string {
        const positiveExamples = this.blueprint.positiveExamples
            .map(this.getPositiveCheckExamplePrompt)
            .join("\n");

        return `You are a text document fixer. ${this.blueprint.instruction}

Do not repeat back the entire text. Only output the edited text plus a bit of context around the edit for context. Here are some positive examples:

${positiveExamples}
`;
    }

    getPositiveCheckExamplePrompt(
        positiveExample: PositiveCheckExample,
    ): string {
        return `Original Text: ${positiveExample.originalText}\nEdited Text: ${positiveExample.editedText}`;
    }

    async checkDoc(doc: string): Promise<string> {
        const data = await this.llm.callFunction({
            prompt: doc,
            functionDesc:
                "Applies the change on the original text to get teh edited text.",
            functionParams: {
                type: "array",
                items: {
                    type: "object",
                    // https://community.openai.com/t/function-call-complex-arrays-as-parameters/295648/2
                    properties: {
                        originalText: {
                            type: "string",
                            description: "The text you found the issue in.",
                        },
                        editedText: {
                            type: "string",
                            description: "The fixed text.",
                        },
                    },
                },
            },
            // TODO: what is this????
            fn: (d) => {
                return d;
            },
        });
        console.log("resdata", data);
        // return response.choices[0].message.content ?? "unknown result";
        return data;
    }
}
