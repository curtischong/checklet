import { Api } from "@api/apis";
import { NormalButton } from "@components/Button";
import {
    CheckBlueprint,
    CheckType,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import {
    defaultCategory,
    defaultDesc,
    defaultEditedText,
    defaultInstructions,
    defaultName,
    defaultOriginalText,
} from "@components/create-check/DefaultTextForCheckType";
import { useClientContext } from "@utils/ClientContext";
import { createUniqueId } from "@utils/strings";
import { useCallback } from "react";

const AdminPage: React.FC = () => {
    const { user } = useClientContext();
    if (user === null || user.email !== "curtischong5@gmail.com") {
        return <div>Not logged in as an admin</div>;
    }

    const createDefaultCheck = useCallback(
        (checkType: CheckType): CheckBlueprint => {
            return {
                name: defaultName[checkType],
                checkType: checkType,
                instruction: defaultInstructions[checkType],
                desc: defaultDesc[checkType],
                category: defaultCategory[checkType],
                positiveExamples: [
                    {
                        originalText: defaultOriginalText[checkType],
                        editedText: defaultEditedText[checkType],
                    },
                ],
                checkId: createUniqueId(),
            };
        },
        [],
    );

    const createRizzume = useCallback(async () => {
        const checkerBlueprint: CheckerBlueprint = {
            name: "Rizzume",
            desc: "Rizz up your resume",
            checkBlueprints: [
                createDefaultCheck(CheckType.highlight),
                createDefaultCheck(CheckType.rephrase),
            ],
            id: createUniqueId(),
            creatorId: user.uid,
            isPublic: true,
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
