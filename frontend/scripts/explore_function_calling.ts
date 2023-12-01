import OpenAI from "openai";

const client = new OpenAI();

async function main() {
    const runner = client.beta.chat.completions
        .runFunctions({
            model: "gpt-3.5-turbo-0613",
            messages: [
                { role: "user", content: "How is the weather this week?" },
            ],
            functions: [
                {
                    function: getCurrentLocation,
                    description: "Get the user's current location",
                    parameters: { type: "object", properties: {} },
                },
                {
                    function: getWeather,
                    description: "Get the weather for a location",
                    parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
                    parameters: {
                        type: "object",
                        properties: {
                            location: { type: "string" },
                        },
                    },
                },
            ],
        })
        .on("message", (message) => console.log(message));

    const finalContent = await runner.finalContent();
    console.log();
    console.log("Final content:", finalContent);
}

async function getCurrentLocation() {
    console.log("called getcurrentlocation");
    return "Boston"; // Simulate lookup
}

async function getWeather(args: { location: string }) {
    const { location } = args;
    const precipitation = "high"; // Simulate lookup
    return { temperature, precipitation };
}

main();

// {role: "user",      content: "How's the weather this week?"}
// {role: "assistant", function_call: "getCurrentLocation", arguments: "{}"}
// {role: "function",  name: "getCurrentLocation", content: "Boston"}
// {role: "assistant", function_call: "getWeather", arguments: '{"location": "Boston"}'}
// {role: "function",  name: "getWeather", content: '{"temperature": "50degF", "preciptation": "high"}'}
// {role: "assistant", content: "It's looking cold and rainy - you might want to wear a jacket!"}
//
// Final content: "It's looking cold and rainy - you might want to wear a jacket!"
