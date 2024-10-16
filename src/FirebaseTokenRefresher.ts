// https://chatgpt.com/share/670f2792-7db4-800e-8730-c2d32211fc51

// it seems like you need to manually refresh the token in firebase auth edge: https://github.com/awinogrodzki/next-firebase-auth-edge/issues/14
import { getAuth } from "firebase/auth";
import { useEffect } from "react";

export const useFirebaseTokenRefresher = (refreshInterval = 30 * 60 * 1000) => {
  useEffect(() => {
    const auth = getAuth();
    const refreshToken = async () => {
      const user = auth.currentUser;

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
  }, [refreshInterval]);
};
