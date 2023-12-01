import { SimpleCache } from "@api/SimpleCache";
import OpenAI from "openai";

const client = new OpenAI();

async function main() {
    // const runner = client.beta.chat.completions
    //     .runFunctions({
    //         model: "gpt-3.5-turbo",
    //         messages: [
    //             { role: "user", content: "How is the weather this week?" },
    //         ],
    //         functions: [
    //             {
    //                 function: getCurrentLocation,
    //                 description: "Get the user's current location",
    //                 parameters: { type: "object", properties: {} },
    //             },
    //             {
    //                 function: getWeather,
    //                 description: "Get the weather for a location",
    //                 parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
    //                 parameters: {
    //                     type: "object",
    //                     properties: {
    //                         location: { type: "string" },
    //                     },
    //                 },
    //             },
    //         ],
    //     })
    //     .on("message", (message) => console.log(message));

    const getSystemPrompt = () => {
        return `You are a text document fixer. clean up all grammar errrors

Do not repeat back the entire text. Only output the edited text plus a bit of context around the edit for context.
`;
    }

    const model = "gpt-3.5-turbo";
    client.chat.completions.create({
        model,
        messages: [{ role: "system", content: getSystemPrompt() }],
    });


    const callData = {
        prompt: "How is the weather this week?",
        functionDesc: "Get the user's current location",
        functionParams: { type: "object", properties: {} },
        fn: (...args) => {
            console.log("called fm")
        },
    };
    }

    const cache = new SimpleCache("checker_test_cache");

    const runner = client.beta.chat.completions
        .runFunctions({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "january is my favourite month",
                },
            ],
            functions: [
                {
                    function: (...args: any[]) => {
                        cache.set(prompt, args);
                        const res = callData.fn(args);
                        resolve(res);
                    },
                    description: callData.functionDesc,
                    parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
                    parameters: callData.functionParams,
                },
            ],
        })
        .on("message", (message) => console.log(message));

    const finalContent = await runner.finalContent();
    console.log();
    console.log("Final content:", finalContent);
}

main();
