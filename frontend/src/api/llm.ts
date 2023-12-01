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
        model = "gpt-3.5-turbo-0613",
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

    // returns params for the function call (these params are a json obj)
    async callFunction(callData: {
        prompt: string;
        functionName: string;
        functionDesc: string;
        functionParams: JSONSchema;
    }): Promise<string> {
        if (this.useCache) {
            const cachedArgStr = this.cache.get(callData.prompt);
            if (cachedArgStr) {
                // console.log("cache success");
                return cachedArgStr;
            }
            // console.log("cache miss", callData.prompt);
        }

        const result = new Promise<string>((resolve, reject) => {
            // resolve the promise after 10 seconds. cause if the API fails to call our function, we'll be stuck here forever
            const timeoutId = setTimeout(() => {
                reject("API call timed out after 10 seconds");
            }, 10000);

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
                                // this is an empty function call because we will manually call the function when we get the assistant response
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
                    if (message.role !== "assistant") {
                        // we need to filter for the assistant message since the systemprompt and user messages will also be here
                        return;
                    }

                    clearTimeout(timeoutId);
                    if (message.function_call) {
                        const args = message.function_call.arguments;
                        this.cache.set(callData.prompt, args);
                        resolve(args);
                    } else {
                        reject(
                            `no function_call made. content=${message.content}}`,
                        );
                    }
                });
        });

        return result;
    }
}
