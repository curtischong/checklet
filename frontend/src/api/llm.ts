import * as fs from "fs";
import * as path from "path";
import { OpenAI } from "openai";
import { SimpleCache } from "@api/SimpleCache";
import { JSONSchema } from "openai/lib/jsonschema";

const logsDir = path.join(process.cwd(), ".chatgpt_history/logs");
const cacheDir = path.join(process.cwd(), ".chatgpt_history/cache");
fs.mkdirSync(logsDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });

const cache = new SimpleCache(cacheDir);

export class Llm {
    useCache: boolean;
    client: OpenAI;
    model: string;

    constructor(
        systemPrompt: string,
        model = "gpt-3.5-turbo",
        useCache = false,
    ) {
        this.useCache = useCache;
        this.client = new OpenAI();
        this.model = model;
        this.client.chat.completions.create({
            model,
            messages: [{ role: "system", content: systemPrompt }],
        });
    }

    async prompt(
        message: OpenAI.ChatCompletionMessageParam,
    ): Promise<OpenAI.ChatCompletion> {
        if (this.useCache) {
            const cachedValue = cache.get(message);
            if (cachedValue) {
                return cachedValue;
            }
        }

        const value = await this.client.chat.completions.create({
            model: this.model,
            messages: [message],
        });
        cache.set(message, value);
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
            const cachedValue = cache.get(prompt);
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
                                cache.set(prompt, args);
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
