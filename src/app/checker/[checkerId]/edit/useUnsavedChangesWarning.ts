/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck
// fixes all numm issues^. but it's not that good. I'm only okay with this because this is an ai-generated file

// https://chatgpt.com/share/66f1c206-d7cc-800e-9cb8-135b3f6171c0
// hooks/useUnsavedChangesWarning.ts
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

type UseUnsavedChangesWarningProps = {
  hasUnsavedChanges: boolean;
};

const useUnsavedChangesWarning = ({
  hasUnsavedChanges,
}: UseUnsavedChangesWarningProps) => {
  const router = useRouter();

  const handleWindowBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
      }
    },
    [hasUnsavedChanges],
  );

  const handleRouteChangeStart = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Wait a few seconds for it to autosave. If this problem persists, copy your changes elsewhere and Curtis will this problem soon!",
      );
      if (!confirmLeave) {
        router.refresh(); // Cancel the navigation by refreshing the current route
      }
    }
  }, [hasUnsavedChanges, router]);

  useEffect(() => {
    // Handle browser/tab close or reload
    window.addEventListener("beforeunload", handleWindowBeforeUnload);

    // Handle client-side navigation
    // Next.js App Router does not expose route change events directly,
    // so we need to wrap the router's push and replace methods.

    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = ((...args: any[]) => {
      handleRouteChangeStart(args[0]);
      return originalPush.apply(router, args);
    }) as typeof router.push;

    router.replace = ((...args: any[]) => {
      handleRouteChangeStart(args[0]);
      return originalReplace.apply(router, args);
    }) as typeof router.replace;

    return () => {
      window.removeEventListener("beforeunload", handleWindowBeforeUnload);
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [handleWindowBeforeUnload, handleRouteChangeStart, router]);
};

export default useUnsavedChangesWarning;
