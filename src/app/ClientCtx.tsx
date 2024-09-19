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
  user,
}: ClientCtxProviderProps): JSX.Element => {
  // const [value, setValue] = React.useState<ClientCtxReact | undefined>();
  const [firebaseAuth, setFirebaseAuth] = React.useState<Auth | undefined>();

  React.useEffect(() => {
    const firebaseApp = initializeApp(clientConfig);
    const firebaseAuth = getAuth(firebaseApp);
    setValue({
      ClientCtx: { firebaseAuth, user: null },
    });
  }, []);

  React.useEffect(() => {
    // only update the userCtx if the userCtx is already set, so we only set the firebaseAuth once
    if (!value?.ClientCtx) {
      return;
    }

    setValue({
      ClientCtx: { user, firebaseAuth: value.ClientCtx.firebaseAuth },
    });
  }, [user, value?.ClientCtx?.firebaseAuth]);

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
