import { ErrorMsg } from "@/app/_components/ErrorMsg";
import { EditorPage } from "@/app/checker/[checkerId]/EditorPage";
import { trackPageView } from "@/mixpanel";
import { parseAuthHeader } from "@/networking_helpers";
import { getCheckerById } from "@/server/api/routers/checker/checker";
import { db } from "@/server/db";
import { isUuid } from "@/utils/strings";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const user = parseAuthHeader();
  trackPageView(user);
  if (!isUuid(params.checkerId)) {
    return (
      <ErrorMsg
        message={"Invalid checker id. Did you copy the url correctly?"}
      />
    );
  }
  const checker = await getCheckerById(db, params.checkerId);
  if (!checker) {
    return (
      <ErrorMsg
        message={"Checker ID not found. Did you copy the url correctly?"}
      />
    );
  }

  return <EditorPage checker={checker} />;
}
