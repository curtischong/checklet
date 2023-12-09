import { Api } from "@api/apis";
import { NormalButton } from "@components/Button";
import {
    CheckBlueprint,
    CheckStatuses,
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
import { useCallback } from "react";
import { toast } from "react-toastify";
import { CheckerId } from "@api/checker";
import { ADMIN_EMAILS } from "src/constants";
import { FileUpload } from "@components/FileUpload";

const AdminPage: React.FC = () => {
    const { user } = useClientContext();
    if (user === null || !ADMIN_EMAILS.includes(user.email ?? "")) {
        return <div>Not logged in as an admin</div>;
    }

    const createDefaultCheck = useCallback(
        (checkType: CheckType): CheckBlueprint => {
            return {
                objInfo: {
                    name: defaultName[checkType],
                    desc: defaultDesc[checkType],
                    id: "fillerId",
                    creatorId: user.uid,
                },
                checkType: checkType,
                instruction: defaultInstructions[checkType],
                category: defaultCategory[checkType],
                positiveExamples: [
                    {
                        originalText: defaultOriginalText[checkType],
                        editedText: defaultEditedText[checkType],
                    },
                ],
            };
        },
        [],
    );

    const createCheck = useCallback(
        async (
            checkType: CheckType,
            checkerId: CheckerId,
            checkStatuses: CheckStatuses,
        ) => {
            const check = createDefaultCheck(checkType);
            const checkId = await Api.createCheck(
                checkerId,
                check.objInfo.name,
                check.checkType,
                user,
            );
            if (!checkId) {
                toast.error("Failed to create check");
                return;
            }
            check.objInfo.id = checkId;
            if (!(await Api.editCheck(check, checkerId, user))) {
                toast.error("Failed to edit check");
                return;
            }
            checkStatuses[checkId] = {
                isEnabled: true,
            };
        },
        [createDefaultCheck],
    );

    const createRizzume = useCallback(async () => {
        const checkerId = await Api.createChecker(user);
        if (!checkerId) {
            toast.error("Failed to create checker");
            return;
        }

        const checkStatuses: CheckStatuses = {};
        await createCheck(CheckType.highlight, checkerId, checkStatuses);
        await createCheck(CheckType.rephrase, checkerId, checkStatuses);

        const checkerBlueprint: CheckerBlueprint = {
            objInfo: {
                name: "Rizzume",
                desc: "Rizz up your resume",
                id: checkerId,
                creatorId: user.uid,
            },
            checkStatuses,
            isPublic: true,
            placeholder: `• Expedited DynamoDB queries from 68 ms to 41 ms by optimizing the schema for reads
• Unified request authorization logic by proxying requests through a Spring API Gateway`,
        };
        await Api.editChecker(checkerBlueprint, user);
    }, []);

    const createChecker = useCallback(async (checkerJson: string) => {
        const parsedCheckerJson = JSON.parse(checkerJson);
        const checkerBlueprint: CheckerBlueprint =
            parsedCheckerJson.checkerBlueprint;
        const checkBlueprints: CheckBlueprint[] =
            parsedCheckerJson.checkBlueprints;
        const checkerId = await Api.createChecker(user);
        if (!checkerId) {
            toast.error("Failed to create checker");
            return;
        }
        checkerBlueprint.objInfo.id = checkerId;
        const oldCheckStatuses = checkerBlueprint.checkStatuses;
        checkerBlueprint.checkStatuses = {};
        const success = await Api.editChecker(checkerBlueprint, user);
        if (!success) {
            toast.error("Failed to edit checker");
            return;
        }

        for (const oldCheckId of Object.keys(oldCheckStatuses)) {
            const isEnabled = oldCheckStatuses[oldCheckId].isEnabled;
            const checkBlueprint = checkBlueprints.find(
                (checkBlueprint) => checkBlueprint.objInfo.id === oldCheckId,
            );
            if (!checkBlueprint) {
                toast.error("Failed to find check blueprint");
                return;
            }
            const check: CheckBlueprint = {
                ...checkBlueprint,
                objInfo: {
                    ...checkBlueprint.objInfo,
                    creatorId: user.uid,
                },
            };
            const checkId = await Api.createCheck(
                checkerId,
                check.objInfo.name,
                check.checkType,
                user,
            );
            if (!checkId) {
                toast.error("Failed to create check");
                return;
            }
            check.objInfo.id = checkId;
            if (!(await Api.editCheck(check, checkerId, user))) {
                toast.error("Failed to edit check");
                return;
            }
            await Api.setCheckIsEnabled(checkId, checkerId, isEnabled, user);
        }
        if (checkerBlueprint.isPublic) {
            await Api.setCheckerIsPublic(
                checkerId,
                checkerBlueprint.isPublic,
                user,
            );
        }

        toast.success("Created checker");
    }, []);

    return (
        <div className="container mx-auto mt-10 flex flex-col px-32">
            <p className="text-2xl text-center">Admin</p>
            <NormalButton className="mt-10 w-60" onClick={createRizzume}>
                Create Rizzume
            </NormalButton>
            <NormalButton
                className="mt-10 w-60"
                onClick={() => localStorage.clear()}
            >
                Clear Localstorage
            </NormalButton>
            <label>Upload Checker</label>
            <FileUpload
                fileType={".json"}
                onFileUpload={(fileText: string) => {
                    console.log(`uploaded creation: ${fileText}`);
                    createChecker(fileText);
                }}
            />
        </div>
    );
};

export default AdminPage;
