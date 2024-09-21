import { type SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { cyrb53 } from "@/utils/strings";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";

export class Llm2 {
  client: OpenAI;
  model: string;
  systemPromptMessage: OpenAI.ChatCompletionMessageParam;

  constructor(
    systemPrompt: string,
    model: string,
    private cache: SimpleCache | undefined,
    apiKey: string | undefined,
  ) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: false,
    });
    this.model = model;
    this.systemPromptMessage = {
      role: "system",
      content: systemPrompt,
    };
  }

  private getKey(messages: any): number {
    return cyrb53(
      `${this.model}-${this.systemPromptMessage.content?.toString()}-${JSON.stringify(messages)}`,
    );
  }

  private cacheGet(messages: any): string | undefined {
    return this.cache?.get(this.getKey(messages)) as string | undefined;
  }
  private cacheSet(messages: any, value: string): void {
    this.cache?.set(this.getKey(messages), value);
  }

  async prompt(message: string): Promise<string> {
    return this.promptMessages([], message);
  }

  async promptMessages(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
  ): Promise<string> {
    const newMessages: ChatCompletionMessageParam[] = [
      ...prevMessages,
      {
        role: "user",
        content: newMessage,
      },
    ];

    if (this.cache) {
      const cachedValue = this.cacheGet(newMessages);
      if (cachedValue) {
        return cachedValue;
      }
    }

    const value = await this.client.chat.completions.create({
      model: this.model,
      messages: [this.systemPromptMessage, ...newMessages],
    });
    const result =
      value.choices[0]?.message.content ??
      "no message returned. please investigate. this was untested";
    this.cacheSet(newMessages, result);
    return result;
  }
}
