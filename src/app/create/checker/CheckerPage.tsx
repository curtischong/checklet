import { NormalButton } from "@/app/_components/ui/Button";
import { Input } from "@/app/_components/ui/Input";
import { LabelWithHelp } from "@/app/_components/ui/LabelWithHelp";
import { NavigationPath } from "@/app/_components/ui/NavigationPath";
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import {
    CheckBlueprint,
    CheckStatuses,
    CheckerBlueprint,
    SaveStatusText,
    SubmittingState,
} from "@/app/create/checker/CheckerTypes";
import { GrammarCheckerPrompt } from "@/app/create/checker/DefaultPrompts";
import { IsPublicSwitch } from "@/app/create/checker/IsPublicSwitch";
import { Editor } from "@/app/editor/Editor";
import {
    ADMIN_EMAILS,
    MAX_CHECKER_DESC_LEN,
    MAX_CHECKER_NAME_LEN,
} from "@/constants";
import { api } from "@/trpc/react";
import { downloadTextFile } from "@/utils/downloadTextFile";
import debounce from "lodash.debounce";
import { UserCtx } from "next-auth";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

export enum Page {
    Main,
    CheckCreator,
}

interface Props {
    checkerId: string;
    user?: UserCtx;
}

export const checkerCreatorMarginTop = 50;

export const CheckerPage = ({ checkerId, user }: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [desc, setDesc] = React.useState(GrammarCheckerPrompt);
    const [placeholder, setPlaceholder] = React.useState("");
    const [checkStatuses, setCheckStatuses] = React.useState<CheckStatuses>({});
    const [submittingState, setSubmittingState] = React.useState(
        SubmittingState.NotSubmitting,
    );
    const [isPublic, setIsPublic] = React.useState(false);
    const [checkBlueprints, setCheckBlueprints] = React.useState<
        CheckBlueprint[]
    >([]);
    const [hasInitialCheckerBeenFetched, setHasInitialCheckerBeenFetched] =
        React.useState(false);

    const router = useRouter();

    const createPost = api.post.create.useMutation({
        onSuccess: async () => {
          await utils.post.invalidate();
          setName("");
        },
      });


    // fetch the checker blueprint from the server
    useEffect(() => {
        if (!user) {
            return;
        }
        (async () => {
            const res = await Api.fetchCheckerBlueprint(
                checkerId as string,
                user,
            );
            if (!res) {
                toast.error("Failed to fetch checker");
                return;
            }
            const { checkerBlueprint, checkBlueprints } = res;
            setName(checkerBlueprint.objInfo.name);
            setDesc(checkerBlueprint.objInfo.desc);
            setPlaceholder(checkerBlueprint.placeholder);
            setCheckStatuses(checkerBlueprint.checkStatuses);
            setIsPublic(checkerBlueprint.isPublic);
            setCheckBlueprints(checkBlueprints);
            setHasInitialCheckerBeenFetched(true);
        })();
    }, [user]);

    const saveChecker = useCallback(
        debounce(
            async (
                newName: string,
                newDesc: string,
                newPlaceholder: string,
                newCheckStatuses: CheckStatuses,
                newIsPublic: boolean,
            ) => {
                if (!user) {
                    toast.error("You must be logged in to create a checker");
                    return;
                }
                // const checkerId =
                //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
                const checker: CheckerBlueprint = {
                    objInfo: {
                        name: newName,
                        desc: newDesc,
                        creatorId: user.uid,
                        id: checkerId,
                    },
                    placeholder: newPlaceholder,
                    checkStatuses: newCheckStatuses,
                    isPublic: newIsPublic,
                };
                setSubmittingState(SubmittingState.Submitting);
                (async () => {
                    const success = await Api.editChecker(checker, user);
                    if (success) {
                        setSubmittingState(SubmittingState.NotSubmitting);
                    } else {
                        setSubmittingState(SubmittingState.ChangesDetected);
                    }
                })();
            },
            1000,
        ),
        [],
    );

    useEffect(() => {
        if (!hasInitialCheckerBeenFetched) {
            return;
        }
        saveChecker(name, desc, placeholder, checkStatuses, isPublic);
    }, [name, desc, placeholder, JSON.stringify(Object.values(checkStatuses))]);

    const downloadChecker = () => {
        downloadTextFile(
            name.replace(" ", "_") + ".json",
            JSON.stringify({
                checkerBlueprint: {
                    objInfo: {
                        name,
                        desc,
                        creatorId: user?.uid ?? "",
                        id: checkerId,
                    },
                    checkStatuses,
                    isPublic,
                    placeholder,
                },
                checkBlueprints,
            }),
        );
    };

    return (
        <div
            className={`flex justify-center mt-[${checkerCreatorMarginTop}px]`}
        >
            <div className="container">
                <div className="flex flex-row">
                    <div
                        className="flex flex-col flex-grow"
                        style={{
                            flexBasis: "0",
                        }}
                    >
                        <NavigationPath
                            sections={[
                                {
                                    name: "Dashboard",
                                    url: "/dashboard",
                                },
                                {
                                    name: "Create checker",
                                },
                            ]}
                        />

                        <div className="flex flex-col">
                            <h1 className="text-3xl mt-4 mb-4 font-bold font-mackinac">
                                {/* <span className="border-b-2 border-blue-300"> */}
                                Create Checker
                            </h1>

                            <label className="text-lg font-bold ml-1 mb-1">
                                Name
                            </label>
                            <Input
                                placeholder="Rizzume"
                                onChange={(e) => {
                                    setSubmittingState(
                                        SubmittingState.ChangesDetected,
                                    );
                                    setName(e.target.value);
                                }}
                                value={name}
                                maxLength={MAX_CHECKER_NAME_LEN}
                            />

                            <label className="text-lg font-bold mt-4 ml-1">
                                Description
                            </label>
                            <NormalTextArea
                                placeholder={"description"}
                                onChange={(e) => {
                                    setSubmittingState(
                                        SubmittingState.ChangesDetected,
                                    );
                                    setDesc(e.target.value);
                                }}
                                value={desc}
                                minRows={4}
                                maxLength={MAX_CHECKER_DESC_LEN}
                            />

                            <LabelWithHelp
                                className="text-lg font-bold mt-4 ml-1"
                                label="Example Document with mistakes"
                                helpText="Use this to test your prompt."
                                helpIconClassName="mt-[7px]"
                            />
                            <Editor
                                storefront={{
                                    objInfo: {
                                        name: name,
                                        desc: desc,
                                        id: checkerId,
                                        creatorId: user?.uid ?? "",
                                    },
                                    placeholder: "test",
                                }}
                            ></Editor>
                            {/* <NormalTextArea
                                placeholder={`• Expedited DynamoDB queries from 68 ms to 41 ms by optimizing the schema for reads
• Unified request authorization logic by proxying requests through a Spring API Gateway`}
                                onChange={(e) => {
                                    setSubmittingState(
                                        SubmittingState.ChangesDetected,
                                    );
                                    setPlaceholder(e.target.value);
                                }}
                                value={placeholder}
                                minRows={4}
                                maxLength={MAX_CHECKER_PLACEHOLDER_LEN}
                            /> */}

                            <div className="flex flex-row mt-4">
                                <IsPublicSwitch
                                    name={name}
                                    desc={desc}
                                    placeholder={placeholder}
                                    checkStatuses={checkStatuses}
                                    isPublic={isPublic}
                                    checkerId={checkerId}
                                />
                                <div className="ml-4">
                                    {SaveStatusText[submittingState]}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-row space-x-8">
                                    <NormalButton
                                        className="mt-4 w-52 h-10"
                                        onClick={() => {
                                            router.push("/dashboard");
                                        }}
                                    >
                                        Return to Dashboard
                                    </NormalButton>
                                    <NormalButton
                                        className="mt-4 px-6 h-10 mx-auto"
                                        onClick={() => {
                                            router.push(`/editor/${checkerId}`);
                                        }}
                                    >
                                        Open checker in editor
                                    </NormalButton>
                                </div>
                                {ADMIN_EMAILS.includes(user?.email ?? "") && (
                                    <NormalButton
                                        className="mt-4"
                                        onClick={downloadChecker}
                                    >
                                        download
                                    </NormalButton>
                                )}
                            </div>
                            <div className="h-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
