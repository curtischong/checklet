import * as fs from "fs";
import * as path from "path";
import { OpenAI } from "openai";
import { SimpleCache } from "@api/SimpleCache";
import { JSONSchema } from "openai/lib/jsonschema";

export class Llm {
    useCache: boolean;
    client: OpenAI;
    model: string;
    cache: SimpleCache;

    constructor(
        systemPrompt: string,
        model = "gpt-3.5-turbo",
        useCache = false,
    ) {
        console.log("llm1");
        this.useCache = useCache;
        this.client = new OpenAI();
        console.log("llm2");
        this.model = model;
        console.log("llm3");
        this.client.chat.completions.create({
            model,
            messages: [{ role: "system", content: systemPrompt }],
        });

        const logsDir = path.join(process.cwd(), ".chatgpt_history/logs");
        const cacheDir = path.join(process.cwd(), ".chatgpt_history/cache");
        fs.mkdirSync(logsDir, { recursive: true });
        fs.mkdirSync(cacheDir, { recursive: true });

        this.cache = new SimpleCache(cacheDir);
    }

    async prompt(
        message: OpenAI.ChatCompletionMessageParam,
    ): Promise<OpenAI.ChatCompletion> {
        if (this.useCache) {
            const cachedValue = this.cache.get(message);
            if (cachedValue) {
                return cachedValue;
            }
        }

        const value = await this.client.chat.completions.create({
            model: this.model,
            messages: [message],
        });
        this.cache.set(message, value);
        return value;
    }

    // TODO: run functions
    async callFunction<Res>(callData: {
        prompt: string;
        functionDesc: string;
        functionParams: JSONSchema;
        fn: (...args: any[]) => Res;
    }): Promise<Res> {
        if (this.useCache) {
            const cachedValue = this.cache.get(prompt);
            if (cachedValue) {
                return callData.fn(...cachedValue);
            }
        }

        const result = new Promise<Res>((resolve, reject) => {
            this.client.beta.chat.completions
                .runFunctions({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: callData.prompt,
                        },
                    ],
                    functions: [
                        {
                            function: (...args: any[]) => {
                                this.cache.set(prompt, args);
                                const res = callData.fn(args);
                                resolve(res);
                            },
                            description: callData.functionDesc,
                            parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
                            parameters: callData.functionParams,
                        },
                    ],
                })
                .on("message", (message) => console.log(message));
        });
        return result;
    }
}
