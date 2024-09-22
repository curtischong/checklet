import { Dashboard, getUserCheckers } from "@/app/dashboard/dashboardPage";
import { parseAuthHeader } from "@/networking_helpers";
import { db } from "@/server/db";

export const page = async () => {
  const user = parseAuthHeader();
  if (!user) {
    return <div> please login to udpate checkers</div>;
  }
  const checkers = await getUserCheckers(db, user);
  return <Dashboard checkers={checkers} />;
};
