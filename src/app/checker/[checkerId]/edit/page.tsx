import { CheckerPage } from "@/app/checker/[checkerId]/edit/CheckerPage";
import { db } from "@/server/db";
import { getUserCtx } from "@/server/firebase/user_ctx";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const userCtx = await getUserCtx();

  const checker = await db.checker.findUnique({
    where: {
      id: params.checkerId,
    },
  });
  if (!checker) {
    return <p>unknown checker</p>;
  }
  if (!userCtx) {
    return <p>You must be logged in to edit this checker</p>;
  }
  if (userCtx.uid !== checker.creatorId) {
    return <p>You must be logged in to edit this checker</p>;
  }

  return <CheckerPage originalChecker={checker} userCtx={session.user} />;
}
