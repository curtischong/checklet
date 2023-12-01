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
    systemPromptMessage: OpenAI.ChatCompletionMessageParam;

    constructor(
        systemPrompt: string,
        model = "gpt-3.5-turbo",
        useCache = false,
    ) {
        this.useCache = useCache;
        this.client = new OpenAI();
        this.model = model;
        this.systemPromptMessage = {
            role: "system",
            content: systemPrompt,
        };

        const cacheDir = path.join(process.cwd(), ".chatgpt_history");
        fs.mkdirSync(cacheDir, { recursive: true });
        this.cache = new SimpleCache(cacheDir + "/cache");
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
            messages: [this.systemPromptMessage, message],
        });
        this.cache.set(message, value);
        return value;
    }

    // TODO: run functions
    async callFunction<Res>(callData: {
        prompt: string;
        functionName: string;
        functionDesc: string;
        functionParams: JSONSchema;
        fn: (...args: any[]) => Res;
    }): Promise<Res> {
        if (this.useCache) {
            const cachedValue = this.cache.get(callData.prompt);
            if (cachedValue) {
                return callData.fn(...cachedValue);
            }
        }

        // do I do anything whn the function is called?
        // do I do anything when I get a response from the assistant?
        // how do I handle timeout?

        const result = new Promise<Res>((resolve, reject) => {
            this.client.beta.chat.completions
                .runFunctions({
                    model: this.model,
                    messages: [
                        this.systemPromptMessage,
                        {
                            role: "user",
                            content: callData.prompt,
                        },
                    ],
                    functions: [
                        {
                            function: (...args: any[]) => {
                                console.log("called function with args", args);
                                this.cache.set(prompt, args);
                                const res = callData.fn(args);
                                resolve(res);
                            },
                            name: callData.functionName,
                            description: callData.functionDesc,
                            parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
                            parameters: callData.functionParams,
                        },
                    ],
                })
                // do not care about this onMessage thing since it triggers for the systmemessage as well
                .on("message", (message) => {
                    // console.log("on message:", message);
                    if (message.role === "assistant") {
                        // the assistant made a response.
                        if (message.function_call) {
                        }
                    }
                });

            // resolve the promise after 3 seconds. cause if the API fails to call our function, we'll be stuck here forever
            setTimeout(() => {
                reject("API call timed out after 3 seconds");
            }, 3000);
        });

        return result;
    }
}
