"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  createWSClient,
  wsLink,
  type TRPCLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "@/server/api/root";
import { type TRPCError } from "@trpc/server";
import { toast } from "react-toastify";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

// this is the non-react version of the client
export const apiClient = createTRPCClient<AppRouter>({
  links: [
    // loggerLink({
    //   enabled: (op) =>
    //     process.env.NODE_ENV === "development" ||
    //     (op.direction === "down" && op.result instanceof Error),
    // }),
    getEndingLink(),
    // httpBatchLink({
    //   transformer: SuperJSON,
    //   url: getBaseUrl() + "/api/trpc",
    //   headers: () => {
    //     const headers = new Headers();
    //     headers.set("x-trpc-source", "nextjs-react");
    //     return headers;
    //   },
    // }),
    // unstable_httpBatchStreamLink({
    //   transformer: SuperJSON,
    //   url: getBaseUrl() + "/api/trpc",
    //   headers: () => {
    //     const headers = new Headers();
    //     headers.set("x-trpc-source", "nextjs-react");
    //     return headers;
    //   },
    // }),
  ],
});

console.log(
  `crate ws client url: ${process.env.NEXT_PUBLIC_SOCKET_HOST}:${process.env.NEXT_PUBLIC_SOCKET_SERVER_EXPOSED_PORT}`,
);

function getEndingLink(): TRPCLink<AppRouter> {
  // if (typeof window === "undefined") {
  //   httpBatchLink({
  //     transformer: SuperJSON,
  //     url: getBaseUrl() + "/api/trpc",
  //     headers: () => {
  //       const headers = new Headers();
  //       headers.set("x-trpc-source", "nextjs-react");
  //       return headers;
  //     },
  //   });
  // }

  const client = createWSClient({
    url: `${process.env.NEXT_PUBLIC_SOCKET_HOST}:${process.env.NEXT_PUBLIC_SOCKET_SERVER_EXPOSED_PORT}`,
  });
  return wsLink({
    client,
    /**
     * @see https://trpc.io/docs/v11/data-transformers
     */
    transformer: SuperJSON,
  });
}

export function handleErr<T>(
  promise: Promise<T>,
  onSuccess?: (res: T) => void,
  onErr?: (err: TRPCError) => void,
) {
  promise.then(onSuccess).catch((err: TRPCError) => {
    toast.error(err.message);
    console.error("An error occurred:", err);
    onErr?.(err);
  });
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        // loggerLink({
        //   enabled: (op) =>
        //     process.env.NODE_ENV === "development" ||
        //     (op.direction === "down" && op.result instanceof Error),
        // }),
        getEndingLink(),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

// function getBaseUrl() {
//   return `${process.env.NEXT_PUBLIC_URL}`;
// }
