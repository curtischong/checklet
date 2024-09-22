import { type SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { cyrb53 } from "@/utils/strings";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface FunctionCallData {
  functionName: string;
  functionDesc: string;
  functionParams: string;
}

type SendMessageResult = OpenAI.Chat.Completions.ChatCompletion.Choice | string;

export class Llm3 {
  client: OpenAI;
  model: string;
  systemPromptMessage: OpenAI.ChatCompletionMessageParam;

  constructor(
    systemPrompt: string,
    private cache: SimpleCache | undefined,
    apiKey: string | undefined,
  ) {
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

  async promptMessages(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
    model: string,
  ): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice> {
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

  async sendMessage(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
    model: string,
    functionCallData?: FunctionCallData,
  ): Promise<SendMessageResult> {
    const newMessages: ChatCompletionMessageParam[] = [
      ...prevMessages,
      {
        role: "user",
        content: newMessage,
      },
    ];

    // Determine cache key based on whether it's a function call or a regular message
    const cacheKey = functionCallData
      ? { type: "function", messages: newMessages }
      : { type: "message", messages: newMessages };

    if (this.cache) {
      const cachedValue = this.cacheGet(cacheKey);
      if (cachedValue) {
        return functionCallData
          ? cachedValue // Assuming cachedValue is a string for function calls
          : (JSON.parse(
              cachedValue,
            ) as OpenAI.Chat.Completions.ChatCompletion.Choice);
      }
    }

    if (functionCallData) {
      // Handle Function Call Scenario
      const { functionName, functionDesc, functionParams } = functionCallData;

      const result = new Promise<string>((resolve, reject) => {
        // Set a timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          reject(new Error("API call timed out after 60 seconds"));
        }, 60000);

        this.client.beta.chat.completions
          .runFunctions({
            model: model,
            messages: [this.systemPromptMessage, ...newMessages],
            functions: [
              {
                name: functionName,
                description: functionDesc,
                parameters: functionParams,
                // The actual function implementation is optional here
                // since we're handling the function call manually
                function: () => {},
              },
            ],
          })
          .on("message", (message: any) => {
            if (message.role !== "assistant") {
              return;
            }

            clearTimeout(timeoutId);

            if (message.function_call) {
              const args = message.function_call.arguments;
              if (this.cache) {
                this.cacheSet(cacheKey, args);
              }
              resolve(args);
            } else {
              reject(
                new Error(
                  `No function call made. Content: ${message.content?.toString()}`,
                ),
              );
            }
          })
          .on("error", (err: any) => {
            clearTimeout(timeoutId);
            reject(err);
          });
      });

      return result;
    } else {
      // Handle Regular Message Scenario
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [this.systemPromptMessage, ...newMessages],
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error("No choice returned. Couldn't generate response.");
      }

      if (this.cache) {
        this.cacheSet(cacheKey, JSON.stringify(choice));
      }

      return choice;
    }
  }
}
