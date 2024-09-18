"use client";
import React from "react";
import { type FirebaseApp, initializeApp } from "firebase/app";
import { type Auth, type User, getAuth } from "firebase/auth";
import { clientConfig } from "@/firebase/config";

export interface ClientCtx {
  firebaseApp: FirebaseApp;
  firebaseAuth: Auth;
  user: User | null;
}

export interface ClientCtxReact {
  ClientCtx: ClientCtx | null;
}

// Create a context
const ClientCtxReactContext = React.createContext<ClientCtxReact>({
  ClientCtx: null,
});

// Create a provider component
export const ClientCtxProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element => {
  const [value, setValue] = React.useState<ClientCtxReact | undefined>();

  React.useEffect(() => {
    const firebaseApp = initializeApp(clientConfig);
    const firebaseAuth = getAuth(firebaseApp);
    // const analytics = getAnalytics(firebaseApp);

    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      // only set the value after the user's login status is known, so we render the page knowing
      setValue({
        ClientCtx: {
          firebaseApp: firebaseApp,
          firebaseAuth: firebaseAuth,
          user: firebaseUser,
        },
      });
    });
    return unsubscribe;
  }, []);

  if (value) {
    return (
      <ClientCtxReactContext.Provider value={value}>
        {children}
      </ClientCtxReactContext.Provider>
    );
  }
  return <></>;
};

export const useClientCtx = (): ClientCtx => {
  const context = React.useContext(ClientCtxReactContext).ClientCtx;
  if (!context) {
    throw new Error("useClientCtx must be used within a ClientProvider");
  }
  return context;
};

export default ClientCtx;
