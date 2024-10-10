/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SimpleCache } from "@/server/api/routers/checker/simpleCache";
import { cyrb53 } from "@/utils/strings";
import { AzureOpenAI } from "openai";
import {
  type ChatCompletion,
  type ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import path from "path";

// https://ai.azure.com/resource/deployments/%2Fsubscriptions%2F57848bd1-af38-4072-907d-4dcb638704c8%2FresourceGroups%2Fchecklet%2Fproviders%2FMicrosoft.CognitiveServices%2Faccounts%2Fchecklet%2Fdeployments%2Fgpt-4o2?wsid=/subscriptions/57848bd1-af38-4072-907d-4dcb638704c8/resourceGroups/checklet/providers/Microsoft.CognitiveServices/accounts/checklet&tid=9d002dce-5d27-40bd-a303-1c4abf109e57
export class AzureLlm {
  client: AzureOpenAI;
  deploymentName: string; // In Azure OpenAI, deployment name is used instead of model name
  systemPromptMessage: ChatCompletionMessageParam;
  model: string;

  constructor(
    deploymentName: string,
    systemPrompt: string,
    private cache: SimpleCache | undefined,
    endpoint: string,
    apiKey: string | undefined,
    apiVersion: string, // e.g., "2023-08-01-preview"
  ) {
    this.deploymentName = deploymentName;
    this.client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion,
      deployment: deploymentName,
    });
    this.systemPromptMessage = {
      role: "system",
      content: systemPrompt,
    };
    this.model = "gpt-4o";
  }

  private getKey(messages: any): number {
    return cyrb53(
      `${this.deploymentName}-${this.systemPromptMessage.content?.toString()}-${JSON.stringify(
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
    return choice.message.content ?? "";
  }

  async promptMessagesExtendChain(
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
  ): Promise<ChatCompletionMessageParam[]> {
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
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
  ): ChatCompletionMessageParam[] {
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
    prevMessages: ChatCompletionMessageParam[],
    newMessage: string,
  ): Promise<ChatCompletion.Choice> {
    const newMessages = this.getNewMessages(prevMessages, newMessage);

    if (this.cache) {
      const cachedValue = this.cacheGet(newMessages);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: newMessages,
    });
    const choice = response.choices[0];
    if (!choice) {
      throw new Error("No choice returned. Couldn't generate response.");
    }
    this.cacheSet(newMessages, JSON.stringify(choice));
    return choice;
  }
}

const cache3 = new SimpleCache(
  path.join(process.cwd(), ".chatgpt_history"),
  "/cache3",
);
export const azureLlmClient = new AzureLlm(
  "gpt-4o2",
  "",
  cache3,
  process.env.AZURE_OPENAI_ENDPOINT!,
  process.env.AZURE_OPENAI_KEY,
  process.env.AZURE_OPENAI_API_VERSION!,
);
