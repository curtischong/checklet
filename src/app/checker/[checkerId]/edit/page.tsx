import { CheckerPage } from "@/app/checker/[checkerId]/edit/CheckerPage";
import { parseAuthHeader } from "@/networking_helpers";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const user = parseAuthHeader();
  if (!user) {
    return <ErrorMsg message={"You must be logged in to edit this checker"} />;
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

const ErrorMsg = ({ message }: { message: string }) => {
  return (
    <div className="mx-auto mt-10 text-center">
      <p>{message}</p>
    </div>
  );
};
