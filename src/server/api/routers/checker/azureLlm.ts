// // wip getting azure llm towork. it doesn't :'(
// import { type SimpleCache } from "@/server/api/routers/checker/simpleCache";
// import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

// const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
// const azureApiKey = process.env.AZURE_OPENAI_KEY ?? "";

// // https://dev.to/azure/a-practical-guide-for-beginners-azure-openai-with-javascript-and-typescript-part-03-2n68
// export class AzureLlm {
//   client: OpenAIClient;
//   deployment = "checklet";

//   constructor(private cache: SimpleCache | undefined) {
//     this.client = new OpenAIClient(
//       endpoint,
//       new AzureKeyCredential(azureApiKey),
//     );
//   }

//   private cacheGet(prompt: string): string | undefined {
//     return this.cache?.get(`${this.deployment}-${prompt}`) as
//       | string
//       | undefined;
//   }
//   private cacheSet(prompt: string, value: string): void {
//     this.cache?.set(`${this.deployment}-${prompt}`, value);
//   }

//   async prompt(message: string): Promise<string> {
//     if (this.cache) {
//       const cachedValue = this.cacheGet(message);
//       if (cachedValue) {
//         return cachedValue;
//       }
//     }

//     const value = await this.client.getCompletions(this.deployment, message, {
//       maxTokens: 20000,
//       temperature: 0.5,
//     });

//     const result =
//       value.choices[0]?.message.content ??
//       "no message returned. please investigate. this was untested";
//     this.cacheSet(message, result);
//     return result;
//   }
// }
