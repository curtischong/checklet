import { Api } from "@api/apis";
import { CreateCheckName } from "@components/create-check/CheckNameCreator";
import { SelectCheckType } from "@components/create-check/SelectCheckType";
import { CheckType } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CreateCheckPage = (): JSX.Element => {
    const { user } = useClientContext();
    const [name, setName] = useState("");
    const [checkType, setCheckType] = useState<CheckType | undefined>(
        undefined,
    );
    const router = useRouter();
    const checkerId = router.query.checkerId as string;

    useEffect(() => {
        (async () => {
            if (user && name !== "" && checkType !== undefined) {
                const checkId = await Api.createCheck(
                    checkerId,
                    name,
                    checkType,
                    user,
                );
                if (!checkId) {
                    return;
                }
                router.push({
                    pathname: `/create/check/${checkerId}`,
                    query: {
                        checkerId,
                        isNew: true,
                    },
                });
            }
        })();
    }, [user, name, checkType]);

    if (!user) {
        return (
            <div>
                <div>You must be logged in the create a checker</div>
                <Link href="/login">Login here</Link>
            </div>
        );
    }

    if (name === "") {
        return <CreateCheckName setCheckName={setName} />;
    }
    return <SelectCheckType setCheckType={setCheckType} />;
};
export default CreateCheckPage;
