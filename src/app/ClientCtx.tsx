"use client";
import { clientConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  getRedirectResult,
  type Auth,
  type User,
} from "firebase/auth";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

export interface ClientCtx {
  firebaseApp: FirebaseApp;
  firebaseAuth: Auth;
  user: UserCtx | null;
  firebaseUser: User | null;
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
    console.log("got firebase auth", firebaseAuth);
    // const analytics = getAnalytics(firebaseApp);

    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      console.log("firebaseUser", firebaseUser);
      // only set the value after the user's login status is known, so we render the page knowing
      setValue({
        ClientCtx: {
          firebaseApp: firebaseApp,
          firebaseAuth: firebaseAuth,
          user: firebaseUserToUserCtx(firebaseUser),
          firebaseUser: firebaseUser,
        },
      });
    });
    return unsubscribe;
  }, []);

  // handle when the user returns
  useEffect(() => {
    if (!value?.ClientCtx?.firebaseAuth) {
      return;
    }
    getRedirectResult(value.ClientCtx.firebaseAuth)
      .then((result) => {
        console.log("result", result);
      })
      .catch((error) => {
        console.error("Error during redirect result:", error);
        toast.error("Something went wrong during login.");
      });
    // void (async () => {
    //   try {
    //     if (!firebaseUser) {
    //       console.warn(
    //         "firebaseUser is null. the user is not logged in. this is only an error if the user came back from loginWithRedirect",
    //       );
    //       return;
    //     }
    //     // the user is logged in. so make the additional calls
    //     const idToken = await firebaseUser.getIdToken();

    //     // Then, we call /api/login endpoint exposed by the middleware.
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/login`, {
    //       headers: {
    //         Authorization: `Bearer ${idToken}`,
    //       },
    //     });
    //     console.log("res", res);

    //     // Create a new user or handle post-login actions
    //     // const additionalUserInfo = getAdditionalUserInfo(firebaseUser);
    //     // if (!additionalUserInfo) {
    //     //   console.warn("additionalUserInfo is null");
    //     // } else {
    //     // Always try to signup during development
    //     handleErr(trpcClient.user.onSignup.mutate(), () => {
    //       void router.push("/checkers");
    //     });
    //     // }
    //   } catch (error) {
    //     console.error("Error during redirect result:", error);
    //     toast.error("Something went wrong during login.");
    //   }
    // })();
  }, [value]);

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
