import { NormalButton } from "@components/Button";
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
    SaveStatusText,
    SubmittingState,
} from "@components/create-checker/CheckerTypes";
import { YourChecks } from "@components/create-checker/YourChecks";
import { NavigationPath } from "@components/NavigationPath";
import { IsPublicSwitch } from "@components/create-checker/IsPublicSwitch";
import debounce from "lodash.debounce";
import { MAX_CHECKER_DESC_LEN, MAX_CHECKER_NAME_LEN } from "src/constants";

export enum Page {
    Main,
    CheckCreator,
}

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

    const saveChecker = useCallback(
        debounce(
            async (
                newName: string,
                newDesc: string,
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
                    checkStatuses: newCheckStatuses,
                    isPublic: newIsPublic,
                };
                console.log("saving checker");
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
        saveChecker(name, desc, checkStatuses, isPublic);
    }, [name, desc, JSON.stringify(Object.values(checkStatuses))]);

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
                                placeholder="Rizzume will rizz up your resume to dazzle any employer. It will make points sharp and salient. All to make you sound impressive."
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

                            <IsPublicSwitch
                                name={name}
                                desc={desc}
                                checkStatuses={checkStatuses}
                                isPublic={isPublic}
                                checkerId={checkerId}
                            />
                            <div className="flex flex-row space-x-8">
                                <NormalButton
                                    className="mt-4 w-52 h-10"
                                    onClick={() => {
                                        router.push("/dashboard");
                                    }}
                                >
                                    Return to Dashboard
                                </NormalButton>
                                <div className="mt-6">
                                    {SaveStatusText[submittingState]}
                                </div>
                            </div>
                            <div className="h-10"></div>
                        </div>
                    </div>
                    <YourChecks
                        checkerId={checkerId}
                        checkBlueprints={checkBlueprints}
                        setCheckBlueprints={setCheckBlueprints}
                        checkStatuses={checkStatuses}
                        setCheckStatuses={(newCheckStatuses: CheckStatuses) => {
                            setSubmittingState(SubmittingState.ChangesDetected);
                            setCheckStatuses(newCheckStatuses);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
