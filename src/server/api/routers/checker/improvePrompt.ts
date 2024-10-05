import OpenAI from "openai";

export const improvePrompt = async (prompt: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: false,
  });

  const completion = await client.createChatCompletion(
    {
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      stream: true, // Enable streaming
    },
    { responseType: "stream" }, // Axios option for handling stream
  );
  completion.data.on("data", (chunk) => {
    const lines = chunk
      .toString()
      .split("\n")
      .filter((line) => line.trim() !== "");
    for (const line of lines) {
      const message = line.replace(/^data: /, "");
      if (message === "[DONE]") {
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }
      try {
        const parsed = JSON.parse(message);
        const content = parsed.choices[0].delta.content || "";
        res.write(`data: ${content}\n\n`); // Send chunk of content to client
      } catch (error) {
        console.error("Error parsing stream message", message, error);
      }
    }
  });
};
