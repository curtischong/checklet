import { type SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { cyrb53 } from "@/utils/strings";
import OpenAI from "openai";
import {
  type ChatCompletionMessageParam,
  type ChatCompletionTool,
} from "openai/resources/index.mjs";

export class Llm3 {
  client: OpenAI;
  model: string;

  constructor(
    model: string,
    private cache: SimpleCache | undefined,
    apiKey: string | undefined,
  ) {
    this.model = model;
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: false,
    });
  }

  private getKey(messages: any, isStream: boolean): number {
    const isStreamKey = isStream ? "stream" : "";
    return cyrb53(`${isStreamKey}-${this.model}-${JSON.stringify(messages)}`);
  }

  private cacheGet(messages: any, isStream: boolean): string | undefined {
    return this.cache?.get(this.getKey(messages, isStream)) as
      | string
      | undefined;
  }

  private cacheSet(messages: any, value: string, isStream: boolean): void {
    this.cache?.set(this.getKey(messages, isStream), value);
  }
  async prompt(message: string, model: string): Promise<string> {
    return (await this.promptMessages([], message, model)).message.content!;
  }

  async promptMessagesExtendChain(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
    model: string,
  ): Promise<ChatCompletionMessageParam[]> {
    const chatCompletion = await this.promptMessages(
      prevMessages,
      newMessage,
      model,
    );
    return [
      ...prevMessages,

      // these two messages are the Q and A of the chat
      {
        role: "user",
        content: newMessage,
      },
      chatCompletion.message,
    ];
  }

  getNewMessages(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
  ): ChatCompletionMessageParam[] {
    return [
      ...prevMessages,
      {
        role: "user",
        content: newMessage,
      },
    ];
  }

  async promptMessages(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
    model: string,
  ): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice> {
    const newMessages = this.getNewMessages(prevMessages, newMessage);

    if (this.cache) {
      const cachedValue = this.cacheGet(newMessages, false);
      if (cachedValue) {
        return JSON.parse(
          cachedValue,
        ) as OpenAI.Chat.Completions.ChatCompletion.Choice;
      }
    }

    const value = await this.client.chat.completions.create({
      model: model,
      messages: newMessages,
    });
    const choice = value.choices[0];
    if (!choice) {
      throw new Error("no choice returned. couldn't generate response");
    }
    this.cacheSet(newMessages, JSON.stringify(choice), false);
    return choice;
  }

  // returns params for the function call (these params are a json obj)
  async callFunction(
    prevMessages: ChatCompletionMessageParam[],
    prompt: string,
    tools: ChatCompletionTool[],
  ): Promise<string> {
    const newMessages = this.getNewMessages(prevMessages, prompt);
    if (this.cache) {
      const cachedArgStr = this.cacheGet(newMessages, false);
      if (cachedArgStr) {
        // console.log("cache success");
        return cachedArgStr;
      }
      // console.log("cache miss", callData.prompt);
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: newMessages,
      tool_choice: "required",
      tools: tools,
    });

    const toolCalls = completion.choices[0]?.message.tool_calls;
    if (!toolCalls) {
      throw new Error("no tool calls made");
    }
    const firstToolCall = toolCalls[0];
    if (!firstToolCall) {
      throw new Error("no tool call made");
    }
    const res = firstToolCall.function.arguments;
    this.cacheSet(newMessages, res, false);
    return res;
  }

  // Define an async generator function for streaming OpenAI responses
  async *streamCompletion(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
  ) {
    const newMessages = this.getNewMessages(prevMessages, newMessage);

    if (this.cache) {
      const cachedValue = this.cacheGet(newMessages, true);
      if (cachedValue) {
        yield cachedValue;
        return;
      }
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: newMessages,
      stream: true, // Enable streaming
    });

    let finalText = "";

    // Handle stream data chunk by chunk
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      if (content) {
        finalText += content;
        // Yield content back to the client
        yield content;
      }
    }
    this.cacheSet(newMessages, finalText, true);
    // return finalText;
  }
}
