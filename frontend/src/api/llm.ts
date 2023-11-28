import * as simplecache from "Simple-Cache"; // https://github.com/mostlygeek/Node-Simple-Cache
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { OpenAI } from "openai";

const logsDir = path.join(process.cwd(), ".chatgpt_history/logs");
const cacheDir = path.join(process.cwd(), ".chatgpt_history/cache");
fs.mkdirSync(logsDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });

const cache = simplecache.SimpleCache(cacheDir);

function getKey(messages: OpenAI.ChatCompletionMessageParam): string {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(messages, null, 0))
        .digest("hex");
}

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
        prompt: OpenAI.ChatCompletionMessageParam,
    ): Promise<OpenAI.ChatCompletion> {
        if (!this.useCache) {
            return await this.client.chat.completions.create({
                model: this.model,
                messages: [prompt],
            });
        }

        const key = getKey(prompt);
        return cache.get(key, async () => {
            return await this.client.chat.completions.create({
                model: this.model,
                messages: [prompt],
            });
        });
    }
}
