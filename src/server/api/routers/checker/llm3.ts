import { type SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { cyrb53 } from "@/utils/strings";
import OpenAI from "openai";
import { type JSONSchema } from "openai/lib/jsonschema";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";

export class Llm3 {
  client: OpenAI;
  model: string;
  systemPromptMessage: OpenAI.ChatCompletionMessageParam;

  constructor(
    model: string,
    systemPrompt: string,
    private cache: SimpleCache | undefined,
    apiKey: string | undefined,
  ) {
    this.model = model;
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: false,
    });
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
      const cachedValue = this.cacheGet(newMessages);
      if (cachedValue) {
        return JSON.parse(
          cachedValue,
        ) as OpenAI.Chat.Completions.ChatCompletion.Choice;
      }
    }

    const value = await this.client.chat.completions.create({
      model: model,
      messages: [this.systemPromptMessage, ...newMessages],
    });
    const choice = value.choices[0];
    if (!choice) {
      throw new Error("no choice returned. couldn't generate response");
    }
    this.cacheSet(newMessages, JSON.stringify(choice));
    return choice;
  }

  // returns params for the function call (these params are a json obj)
  async callFunction(
    prevMessages: ChatCompletionMessageParam[],
    prompt: string,
    callData: {
      functionName: string;
      functionDesc: string;
      functionParams: JSONSchema;
    },
  ): Promise<string> {
    const newMessages = this.getNewMessages(prevMessages, prompt);
    if (this.cache) {
      const cachedArgStr = this.cacheGet(callData.prompt);
      if (cachedArgStr) {
        // console.log("cache success");
        return cachedArgStr;
      }
      // console.log("cache miss", callData.prompt);
    }

    const result = new Promise<string>((resolve, reject) => {
      // resolve the promise after 10 seconds. cause if the API fails to call our function, we'll be stuck here forever
      const timeoutId = setTimeout(() => {
        reject(new Error("API call timed out after 10 seconds"));
      }, 60000);

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
            this.cacheSet(callData.prompt, args);
            resolve(args);
          } else {
            reject(
              Error(
                `no function_call made. content=${message.content?.toString()}}`,
              ),
            );
          }
        });
    });

    return result;
  }
}
