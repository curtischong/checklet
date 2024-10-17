// https://github.com/vercel/ai/issues/1066
// basically, streaming from openAI via azure happens in chunks, which doesn't look good on the client. so we artificially smooth it out
// PERF: we do this in the client, so when we receive all chunks, we can immediately ask the server for the second prompt (while the first text is streaming to the client)

const MIN_TIME_BETWEEN_TOKENS_MS = 5;

export async function* logStream(
  originalStreamOrGenerator: ReadableStream | AsyncIterable<any>,
) {
  let asyncIterable: AsyncIterable<any>;

  if (originalStreamOrGenerator instanceof ReadableStream) {
    // Convert ReadableStream to async iterable
    const reader = originalStreamOrGenerator.getReader();
    asyncIterable = {
      async *[Symbol.asyncIterator]() {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) return;
            yield value;
          }
        } finally {
          reader.releaseLock();
        }
      },
    };
  } else if (Symbol.asyncIterator in originalStreamOrGenerator) {
    // It's already an async iterable (e.g., an async generator)
    asyncIterable = originalStreamOrGenerator;
  } else {
    throw new TypeError("Input must be a ReadableStream or an async iterable");
  }

  for await (const chunk of asyncIterable) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_TIME_BETWEEN_TOKENS_MS),
    );
    yield chunk;
  }
}
