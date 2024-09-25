import { EditorPage } from "@/app/checker/[checkerId]/EditorPage";
import { getCheckerById } from "@/server/api/routers/checker/checker";
import { db } from "@/server/db";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const checker = await getCheckerById(db, params.checkerId);

  return <EditorPage checker={checker} />;
}
