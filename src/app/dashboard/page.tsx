import { ErrorMsg } from "@/app/_components/ErrorMsg";
import { Dashboard } from "@/app/dashboard/dashboardPage";
import { trackPageView } from "@/mixpanel";
import { parseAuthHeader } from "@/networking_helpers";

export default function page() {
  trackPageView();
  // TODO: redirect to /signin if not logged in
  const user = parseAuthHeader();
  if (!user) {
    return <ErrorMsg message={"Please login to edit your checkers"} />;
  }
  // const checkers = await getUserCheckers(db, user);
  return <Dashboard user={user} />;
}
