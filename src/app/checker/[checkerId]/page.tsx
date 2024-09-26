import { EditorPage } from "@/app/checker/[checkerId]/EditorPage";
import { trackPageView } from "@/mixpanel";
import { parseAuthHeader } from "@/networking_helpers";
import { getCheckerById } from "@/server/api/routers/checker/checker";
import { db } from "@/server/db";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const user = parseAuthHeader();
  trackPageView(user);
  const checker = await getCheckerById(db, params.checkerId);

  // TODO: if the user is NOT logged in. and they are trying to access a private checker, or if they are logged in but not the owner
  // of the private checker, we need to redirect them away. do in the middleware?

  return <EditorPage checker={checker} />;
}
