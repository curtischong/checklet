import { ADMIN_EMAILS } from "@/constants";
import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { NormalButton } from "@components/Button";
import { FileUpload } from "@components/FileUpload";
import {
    defaultCategory,
    defaultDesc,
    defaultEditedText,
    defaultInstructions,
    defaultName,
    defaultOriginalText,
    rizzumeDesc,
} from "@components/create-check/DefaultTextForCheckType";
import {
    CheckBlueprint,
    CheckStatuses,
    CheckType,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import { useCallback } from "react";
import { toast } from "react-toastify";

const AdminPage: React.FC = () => {
    const { user } = useClientContext();

    const createDefaultCheck = useCallback(
        (checkType: CheckType): CheckBlueprint => {
            if (!user) {
                throw new Error("User is null");
            }
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
        [user],
    );

    const createCheck = useCallback(
        async (
            checkType: CheckType,
            checkerId: CheckerId,
            checkStatuses: CheckStatuses,
        ) => {
            if (!user) {
                throw new Error("User is null");
            }
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
        [createDefaultCheck, user],
    );

    const createRizzume = useCallback(async () => {
        if (!user) {
            toast.error("Not logged in");
            return;
        }
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
                desc: rizzumeDesc,
                id: checkerId,
                creatorId: user.uid,
            },
            checkStatuses,
            isPublic: true,
            placeholder: `• Expedited DynamoDB queries from 68 ms to 41 ms by optimizing the schema for reads
• Unified request authorization logic by proxying requests through a Spring API Gateway`,
        };
        const res = await Api.editChecker(checkerBlueprint, user);
        if (res) {
            toast.success("Created checker");
        }
    }, [createCheck, user]);

    const createChecker = useCallback(
        async (checkerJson: string) => {
            if (!user) {
                toast.error("Not logged in");
                return;
            }
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
                    (checkBlueprint) =>
                        checkBlueprint.objInfo.id === oldCheckId,
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
                await Api.setCheckIsEnabled(
                    checkId,
                    checkerId,
                    isEnabled,
                    user,
                );
            }
            if (checkerBlueprint.isPublic) {
                await Api.setCheckerIsPublic(
                    checkerId,
                    checkerBlueprint.isPublic,
                    user,
                );
            }

            toast.success("Created checker");
        },
        [user],
    );

    if (user === null || !ADMIN_EMAILS.includes(user.email ?? "")) {
        return (
            <div className="text-3xl font-mackinac mx-auto mt-32 text-center">
                Not logged in as an admin
            </div>
        );
    }

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
                    console.log(`uploaded checker: ${fileText}`);
                    createChecker(fileText);
                }}
            />
        </div>
    );
};

export default AdminPage;
