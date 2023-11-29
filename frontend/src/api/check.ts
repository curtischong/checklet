import { Llm } from "@api/llm";
import { CheckBlueprint } from "@components/create-checker/Check";
import { PositiveCheckExample } from "@components/create-checker/PositiveCheckExampleCreator";
import { ChatCompletionUserMessageParam } from "openai/resources";

export class Check {
    llm: Llm;

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
            functionDesc: "Fixes text",
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
            fn: (d) => {
                return d;
            },
        });
        console.log(data);
        // return response.choices[0].message.content ?? "unknown result";
        return data;
    }
}
