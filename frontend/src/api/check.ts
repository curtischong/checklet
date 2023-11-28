import { Llm } from "@api/llm";
import { ChatCompletionUserMessageParam } from "openai/resources";

class PositiveExample {
    originalText: string;
    editedText: string;

    constructor(originalText: string, editedText: string) {
        this.originalText = originalText;
        this.editedText = editedText;
    }

    toString(): string {
        return `Original Text: ${this.originalText}\nEdited Text: ${this.editedText}`;
    }
}

class Check {
    name: string;
    instruction: string;
    longDesc: string;
    category: string;
    positiveExamples: PositiveExample[];
    llm: Llm;

    constructor(
        name: string,
        instruction: string,
        longDesc: string,
        category: string,
        positiveExamples: PositiveExample[],
    ) {
        this.name = name;
        this.instruction = instruction;
        this.longDesc = longDesc;
        this.category = category;
        this.positiveExamples = positiveExamples;
        this.llm = new Llm(this.getSystemPrompt(), "gpt-3.5-turbo", true);
    }

    getSystemPrompt(): string {
        const positiveExamples = this.positiveExamples
            .map((example) => example.toString())
            .join("\n");

        return `You are a text document fixer. ${this.instruction}

Do not repeat back the entire text. Only output the edited text plus a bit of context around the edit for context. Here are some positive examples:

${positiveExamples}
`;
    }

    async checkDoc(doc: string): Promise<string> {
        const prompt: ChatCompletionUserMessageParam = {
            role: "user",
            content: doc,
        };
        const response = await this.llm.prompt(prompt);
        return response.choices[0].message.content ?? "unknown result";
    }
}
