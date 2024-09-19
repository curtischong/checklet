import { CheckerPage } from "@/app/checker/[checkerId]/edit/CheckerPage";
import { parseAuthHeader } from "@/networking_helpers";
import { db } from "@/server/db";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const user = parseAuthHeader();

  const checker = await db.checker.findUnique({
    where: {
      id: params.checkerId,
    },
  });
  if (!checker) {
    return <p>unknown checker</p>;
  }
  if (!user) {
    return <p>You must be logged in to edit this checker</p>;
  }
  if (user.id !== checker.creatorId) {
    return <p>You must be logged in to edit this checker</p>;
  }

  return <CheckerPage originalChecker={checker} userCtx={session.user} />;
}
