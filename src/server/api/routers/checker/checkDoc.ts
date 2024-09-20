import { type CheckerType } from "@/server/api/routers/checker/checker";

export const checkDoc = async (doc: string, checker: Awaited<CheckerType>) => {
  console.log("checkDoc", doc, checker);
  return {
    suggestions: [],
  };
};
