import { CheckerPage } from "@/app/create/checker/[checkerId]/CheckerPage";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const session = await getServerAuthSession();
  const checker = await db.checker.findUnique({
    where: {
      id: params.checkerId,
    },
  });
  if (!checker) {
    return <p>unknown checker</p>;
  }
  if (!session?.user) {
    return <p>You must be logged in to view this checker</p>;
  }

  return <CheckerPage originalChecker={checker} userCtx={session.user} />;
}
