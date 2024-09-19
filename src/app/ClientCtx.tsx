"use client";
import React from "react";
import { type FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, type Auth, type User } from "firebase/auth";
import { clientConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";

export interface ClientCtx {
  // firebaseApp: FirebaseApp;
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

// const firebaseUserToUserCtx = (user: User | null): UserCtx | null => {
//   if (!user) {
//     return null;
//   }
//   return {
//     id: user.uid,
//     email: user.email ?? "error: no email",
//     email_verified: user.emailVerified,
//   };
// };

interface ClientCtxProviderProps {
  children: React.ReactNode | React.ReactNode[];
  user: UserCtx | null;
}

// Create a provider component
export const ClientCtxProvider = ({
  children,
  user, // the user is passed in from the server. I think this saves an extra call so we don't need to always get the user from the firebase auth
}: ClientCtxProviderProps): JSX.Element => {
  const [firebaseAuth, setFirebaseAuth] = React.useState<Auth | undefined>();
  const [value, setValue] = React.useState<ClientCtxReact | undefined>();

  React.useEffect(() => {
    const firebaseApp = initializeApp(clientConfig);
    const firebaseAuth = getAuth(firebaseApp);
    setFirebaseAuth(firebaseAuth);
  }, []);

  React.useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    setValue({
      ClientCtx: { user, firebaseAuth },
    });
  }, [user, firebaseAuth]);

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
