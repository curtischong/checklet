import { Api } from "@api/apis";
import { NormalButton } from "@components/Button";
import {
    CheckType,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { createUniqueId } from "@utils/strings";
import { useCallback } from "react";

const AdminPage: React.FC = () => {
    const { user } = useClientContext();
    if (user === null || user.email !== "curtischong5@gmail.com") {
        return <div>Not logged in as an admin</div>;
    }

    const createRizzume = useCallback(async () => {
        const checkerBlueprint: CheckerBlueprint = {
            name: "Rizzume",
            desc: "Rizz up your resume",
            checkBlueprints: [
                {
                    name: "Shorten Month",
                    checkType: CheckType.rephrase,
                    instruction: `If you see the name of the month, shorten it to only three characters. Do not end these shortened months with a period.`,
                    desc: `Shorter months create more whitespace.`,
                    category: "Whitespace",
                    positiveExamples: [
                        {
                            originalText: "January",
                            editedText: "Jan",
                        },
                    ],
                    checkId: createUniqueId(),
                },
            ],
            id: createUniqueId(),
            creatorId: user.uid,
        };
        Api.createChecker(
            checkerBlueprint,
            checkerBlueprint.id,
            await user.getIdToken(),
        );
    }, []);
    return (
        <div className="container mx-auto mt-10 flex flex-col px-32">
            <p className="text-2xl text-center">Admin</p>
            <NormalButton className="mt-10 w-60" onClick={createRizzume}>
                Create Rizzume
            </NormalButton>
        </div>
    );
};

export default AdminPage;
