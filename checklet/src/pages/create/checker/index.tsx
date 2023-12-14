import { MustBeLoggedInMsg } from "@/components/MustBeLoggedInMsg";
import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { CheckerCreator } from "@components/create-checker/CheckerCreator";
import { useClientContext } from "@utils/ClientContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// they're not really supposed to be on this page. but whatever, I'll create a new checker if they do land here
const CheckerCreatorPage = (): JSX.Element => {
    const [checkerId, setCheckerId] = useState<CheckerId>("");
    const { user } = useClientContext();
    useEffect(() => {
        if (!user) {
            return;
        }
        (async () => {
            const res = await Api.createChecker(user);
            if (!res) {
                toast.error("Failed to create checker");
                return;
            }
            setCheckerId(res);
        })();
    }, []);
    if (!user) {
        return <MustBeLoggedInMsg />;
    }
    if (!checkerId) return <>loading...</>;
    return <CheckerCreator checkerId={checkerId} />;
};
export default CheckerCreatorPage;
