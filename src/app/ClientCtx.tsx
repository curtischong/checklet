"use client";
import { clientConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";
import { useFirebaseTokenRefresher } from "@/FirebaseTokenRefresher";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, type User } from "firebase/auth";
import React from "react";

export interface ClientCtx {
  firebaseApp: FirebaseApp;
  firebaseAuth: Auth;
  user: UserCtx | null;
}

export interface ClientCtxReact {
  ClientCtx: ClientCtx | null;
}

// Create a context
const ClientCtxReactContext = React.createContext<ClientCtxReact>({
  ClientCtx: null,
});

const firebaseUserToUserCtx = (user: User | null): UserCtx | null => {
  if (!user) {
    return null;
  }
  return {
    id: user.uid,
    email: user.email ?? "error: no email",
    email_verified: user.emailVerified,
  };
};

// Create a provider component
export const ClientCtxProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}): JSX.Element => {
  const [value, setValue] = React.useState<ClientCtxReact | undefined>();

  useFirebaseTokenRefresher(); // we are putting this token refresher here (rather than in the layout) since hte layout is a server-side component

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
          user: firebaseUserToUserCtx(firebaseUser),
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
