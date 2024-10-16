"use client";
import { type GetTrpcClientType, getTrpcClient } from "@/trpc/react";
import React from "react";

export interface TrpcCtx {
  trpcClient: GetTrpcClientType;
}

export interface TrpcCtxReact {
  trpcClientCtx: TrpcCtx | null;
}

// Create a context
const TrpcCtxReactContext = React.createContext<TrpcCtxReact>({
  trpcClientCtx: null,
});

// Create a provider component
export const TrpcCtxProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element => {
  const [value, setValue] = React.useState<TrpcCtxReact | undefined>();

  React.useEffect(() => {
    setValue({
      trpcClientCtx: {
        trpcClient: getTrpcClient(),
      },
    });
  }, []);

  if (value) {
    return (
      <TrpcCtxReactContext.Provider value={value}>
        {children}
      </TrpcCtxReactContext.Provider>
    );
  }
  return <></>;
};

export const useTrpcCtx = (): TrpcCtx => {
  const context = React.useContext(TrpcCtxReactContext).trpcClientCtx;
  if (!context) {
    throw new Error("useTrpcCtx must be used within a TrpcCtxProvider");
  }
  return context;
};
