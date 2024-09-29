import { ErrorMsg } from "@/app/_components/ErrorMsg";
import { CheckerPage } from "@/app/checker/[checkerId]/edit/CheckerPage";
import { trackPageView } from "@/mixpanel";
import { parseAuthHeader } from "@/networking_helpers";

export default function Page({ params }: { params: { checkerId: string } }) {
  const user = parseAuthHeader();
  trackPageView(user);
  if (!user) {
    return <ErrorMsg message={"Please login to edit this checker"} />;
  }

  // const checker = await db.checker.findUnique({
  //   where: {
  //     id: params.checkerId,
  //   },
  // });
  // if (!checker) {
  //   return <p>unknown checker</p>;
  // }
  // if (user.id !== checker.createdById) {
  //   return (
  //     <ErrorMsg
  //       message={
  //         "You are not the creator of this checker. So you cannot edit it!"
  //       }
  //     />
  //   );
  // }

  return <CheckerPage userCtx={user} checkerId={params.checkerId} />;
}
