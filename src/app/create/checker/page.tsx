import { CheckerPage } from "@/app/create/checker/CheckerPage";
import { getServerAuthSession } from "@/server/auth";

export default async function Page() {
    const session = await getServerAuthSession();

    return <CheckerPage checkerId="1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161" user={session?.user} />;
}