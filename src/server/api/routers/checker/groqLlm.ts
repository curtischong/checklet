/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { cyrb53 } from "@/utils/strings";
import Groq from "groq-sdk";
import path from "path";

export class GroqLlm {
  client: Groq;
  systemPromptMessage: Groq.Chat.ChatCompletionMessageParam;
  model: string;
  cache: SimpleCache | undefined;
  temperature: number;

  constructor(
    systemPrompt: string,
    cache: SimpleCache | undefined,
    apiKey: string,
    model: string,
    temperature = 0.5,
  ) {
    this.client = new Groq({ apiKey });
    this.systemPromptMessage = {
      role: "system",
      content: systemPrompt,
    };
    this.model = model;
    this.cache = cache;
    this.temperature = temperature;
  }

  private getKey(messages: any): number {
    return cyrb53(
      `${this.model}-${this.systemPromptMessage.content?.toString()}-${JSON.stringify(
        messages,
      )}`,
    );
  }

  private cacheGet(messages: any): string | undefined {
    return this.cache?.get(this.getKey(messages)) as string | undefined;
  }

  private cacheSet(messages: any, value: string): void {
    this.cache?.set(this.getKey(messages), value);
  }

  async prompt(message: string): Promise<string> {
    const choice = await this.promptMessages([], message);
    return choice.message?.content ?? "";
  }

  async promptMessagesExtendChain(
    prevMessages: Groq.Chat.ChatCompletionMessageParam[],
    newMessage: string,
  ): Promise<Groq.Chat.ChatCompletionMessageParam[]> {
    const chatCompletion = await this.promptMessages(prevMessages, newMessage);
    return [
      ...prevMessages,
      {
        role: "user",
        content: newMessage,
      },
      chatCompletion.message,
    ];
  }

  getNewMessages(
    prevMessages: Groq.Chat.Completions.ChatCompletionMessageParam[],
    newMessage: string,
  ): Groq.Chat.Completions.ChatCompletionMessageParam[] {
    return [
      this.systemPromptMessage,
      ...prevMessages,
      {
        role: "user",
        content: newMessage,
      },
    ];
  }

  async promptMessages(
    prevMessages: Groq.Chat.Completions.ChatCompletionMessageParam[],
    newMessage: string,
  ): Promise<Groq.Chat.Completions.ChatCompletion.Choice> {
    const newMessages = this.getNewMessages(prevMessages, newMessage);

    if (this.cache) {
      const cachedValue = this.cacheGet(newMessages);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }
    }

    const response = await this.client.chat.completions.create({
      messages: newMessages,
      model: this.model,
      temperature: this.temperature,
    });
    const choice = response.choices[0];
    if (!choice) {
      throw new Error("No choice returned. Couldn't generate response.");
    }
    this.cacheSet(newMessages, JSON.stringify(choice));
    return choice;
  }
}

const cache4 = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache4",
);
export const groqLlmClient = new GroqLlm(
  "", // You can add a system prompt here if needed
  cache4,
  process.env.GROQ_API_KEY!,
  "llama-3.1-70b-versatile", // Specify the model you want to use
);
