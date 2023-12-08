import {
    LoadingButtonSubmit,
    NormalButton,
    SubmittingState,
} from "@components/Button";
import { Input } from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useClientContext } from "@utils/ClientContext";
import { Api } from "@api/apis";
import { NormalTextArea } from "@components/TextArea";
import {
    CheckBlueprint,
    CheckStatuses,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { YourChecks } from "@components/create-checker/YourChecks";
import { NavigationPath } from "@components/NavigationPath";
import { IsPublicSwitch } from "@components/create-checker/IsPublicSwitch";

export enum Page {
    Main,
    CheckCreator,
}

const SubmitButtonText = {
    [SubmittingState.NotSubmitting]: "Create Checker",
    [SubmittingState.Submitting]: "Creating Checker",
    [SubmittingState.Submitted]: "Checker Created!",
};
interface Props {
    checkerId: string;
}

export const CheckerCreator = ({ checkerId }: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [checkStatuses, setCheckStatuses] = React.useState<CheckStatuses>({});
    const [submittingState, setSubmittingState] = React.useState(
        SubmittingState.NotSubmitting,
    );
    const [isPublic, setIsPublic] = React.useState(false);
    const [checkBlueprints, setCheckBlueprints] = React.useState<
        CheckBlueprint[]
    >([]);
    const { user } = useClientContext();

    const router = useRouter();

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
            setCheckStatuses(checkerBlueprint.checkStatuses);
            setIsPublic(checkerBlueprint.isPublic);
            setCheckBlueprints(checkBlueprints);
        })();
    }, [user]);

    const editChecker = useCallback(() => {
        if (!user) {
            toast.error("You must be logged in to create a checker");
            return;
        }

        const checker: CheckerBlueprint = {
            objInfo: {
                name,
                desc,
                creatorId: user.uid,
                id: checkerId,
            },
            checkStatuses,
            isPublic,
        };

        // const checkerId =
        //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
        setSubmittingState(SubmittingState.Submitting);
        (async () => {
            await Api.editChecker(checker, user);
            setSubmittingState(SubmittingState.Submitted);
            setTimeout(() => {
                setSubmittingState(SubmittingState.NotSubmitting);
            }, 3000);
        })();
    }, [name, desc, checkStatuses, user, checkerId]);

    return (
        <div className="flex justify-center">
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

                        <div className="w-[450px] mx-auto flex flex-col">
                            <h1 className="text-3xl mt-4 mb-4 font-bold">
                                {/* <span className="border-b-2 border-blue-300"> */}
                                Create Checker
                            </h1>

                            <label className="text-lg font-bold ml-1 mb-1">
                                Name
                            </label>
                            <Input
                                placeholder="Rizzume"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                value={name}
                            />

                            <label className="text-lg font-bold mt-4 ml-1">
                                Description
                            </label>
                            <NormalTextArea
                                placeholder="Rizzume will rizz up your resume to dazzle any employer. It will make points sharp and salient. All to make you sound impressive."
                                onChange={(e) => {
                                    setDesc(e.target.value);
                                }}
                                value={desc}
                                minRows={4}
                            />

                            <IsPublicSwitch
                                name={name}
                                desc={desc}
                                checkStatuses={checkStatuses}
                                isPublic={isPublic}
                                checkerId={checkerId}
                            />
                            <div className="flex flex-row space-x-8">
                                <LoadingButtonSubmit
                                    isLoading={
                                        submittingState ===
                                        SubmittingState.Submitting
                                    }
                                    onClick={editChecker}
                                    className="mt-4 w-40 h-10"
                                >
                                    {SubmitButtonText[submittingState]}
                                </LoadingButtonSubmit>
                                <NormalButton
                                    className="mt-4 w-52 h-10"
                                    onClick={() => {
                                        router.push("/dashboard");
                                    }}
                                >
                                    Return to Dashboard
                                </NormalButton>
                            </div>
                            <div className="h-10"></div>
                        </div>
                    </div>
                    <YourChecks
                        checkerId={checkerId}
                        checkBlueprints={checkBlueprints}
                        setCheckBlueprints={setCheckBlueprints}
                        checkStatuses={checkStatuses}
                        setCheckStatuses={setCheckStatuses}
                    />
                </div>
            </div>
        </div>
    );
};
