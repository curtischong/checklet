"use client";
import { clientConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, type User } from "firebase/auth";
import React, { useEffect } from "react";

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

  // https://chatgpt.com/share/670f2792-7db4-800e-8730-c2d32211fc51
  // it seems like you need to manually refresh the token in firebase auth edge: https://github.com/awinogrodzki/next-firebase-auth-edge/issues/14
  const refreshInterval = 30 * 60 * 1000;
  useEffect(() => {
    // this if statement is very important! we must depend on firebaseAuth since we know that firebaseApp has been initialized
    if (!value?.ClientCtx?.firebaseAuth) {
      return;
    }

    const refreshToken = async () => {
      const user = value.ClientCtx?.firebaseAuth.currentUser;

      if (user) {
        // Get the new token
        const idToken = await user.getIdToken(true);

        // Update your API login endpoint with the new token
        await fetch("/api/login", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      }
    };

    // TODO: do we need to refresh the token initially? I think we do? I'll enable it if ppl complain
    // refreshToken();

    // Set up periodic refresh
    const interval = setInterval(() => {
      void refreshToken();
    }, refreshInterval);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [refreshInterval, value]);

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
