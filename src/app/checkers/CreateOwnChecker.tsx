"use client";
import { useClientCtx } from "@/app/ClientCtx";
import { useRouter } from "next/navigation";

export const CreateOwnChecker = () => {
  const router = useRouter();
  const { user } = useClientCtx(); // this user object cannnot be passed in from a server-side rendered prop since it can be outdated

  return (
    <div className="mx-auto mt-2">
      Can&lsquo;t find a checker you like?{" "}
      <span
        className="mx-auto mt-4 cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
        onClick={() => {
          if (!user) {
            router.push("/signin?redirect-reason=create-checker");
          } else {
            router.push(`/dashboard`);
          }
        }}
      >
        Create your own Checker
      </span>
    </div>
  );
};
