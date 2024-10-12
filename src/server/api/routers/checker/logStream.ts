// https://github.com/vercel/ai/issues/1066
// basically, streaming from openAI via azure happens in chunks, which doesn't look good on the client. so we artificially smooth it out

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
    await new Promise((resolve) => setTimeout(resolve, 7));
    yield chunk;
  }
}
