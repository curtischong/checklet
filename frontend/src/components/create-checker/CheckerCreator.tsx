import {
    LoadingButtonSubmit,
    NormalButton,
    SubmittingState,
} from "@components/Button";
import { CheckCreator } from "@components/create-checker/CheckCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { SetState } from "@utils/types";
import { Input } from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useClientContext } from "@utils/ClientContext";
import { Api } from "@api/apis";
import { RightArrowIcon } from "@components/icons/RightArrowIcon";
import { NormalTextArea } from "@components/TextArea";
import { createUniqueId } from "@utils/strings";
import {
    CheckBlueprint,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { CheckOverview } from "@components/create-checker/CheckOverview";

export enum Page {
    Main,
    CheckCreator,
}

export const CheckerCreator: React.FC = () => {
    const [name, setName] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [checkBlueprints, setCheckBlueprints] = React.useState<
        CheckBlueprint[]
    >([]);
    const [checkerId, setCheckerId] = React.useState<string>(createUniqueId());
    const [pageData, setPageData] = React.useState<unknown>(null);
    const [submittingState, setSubmittingState] = React.useState(
        SubmittingState.NotSubmitting,
    );
    const { user } = useClientContext();

    // https://stackoverflow.com/questions/60036703/is-it-possible-to-define-hash-route-in-next-js
    const router = useRouter();
    const hash = router.asPath.split("#")[1] || "";
    const page = hash === "check" ? Page.CheckCreator : Page.Main;
    const setPage = (page: Page, pageData?: any) => {
        setPageData(pageData);
        if (page === Page.Main) {
            // forward the url params to persist the checkerId in the url
            const urlParams = new URLSearchParams(window.location.search);
            router.push({
                pathname: "",
                query: {
                    checkerId: Object.fromEntries(urlParams).checkerId,
                },
            });
        } else {
            let query = {};
            if (pageData?.initialCheckBlueprint?.checkId) {
                query = {
                    checkerId: checkerId,
                    checkId: pageData.initialCheckBlueprint.checkId,
                };
            }
            router.push({
                hash: "check",
                query,
            });
        }
    };

    useEffect(() => {
        const data = router.query;
        (async () => {
            if (!data.checkerId || !user) {
                return;
            }
            const checkerBlueprint = await Api.fetchCheckerBlueprint(
                await user.getIdToken(),
                data.checkerId as string,
            );
            if (!checkerBlueprint) {
                return;
            }
            setName(checkerBlueprint.name);
            setDesc(checkerBlueprint.desc);
            setCheckerId(checkerBlueprint.id);
            setCheckBlueprints(checkerBlueprint.checkBlueprints);
        })();
    }, [user]);

    return (
        <div className="flex justify-center ">
            <div className="container">
                {page === Page.Main ? (
                    <MainCheckerPage
                        name={name}
                        setName={setName}
                        desc={desc}
                        setDesc={setDesc}
                        checkBlueprints={checkBlueprints}
                        setCheckBlueprints={setCheckBlueprints}
                        checkerId={checkerId}
                        setPage={setPage}
                    />
                ) : (
                    <CheckCreator
                        submittingState={submittingState}
                        onCreate={(check) => {
                            const existingCheckIdx = checkBlueprints.findIndex(
                                (c) => c.checkId === check.checkId,
                            );
                            const newCheckBlueprints = [...checkBlueprints];
                            if (existingCheckIdx !== -1) {
                                // this check already exists. So we find its index, and replace it
                                newCheckBlueprints[existingCheckIdx] = check;
                            } else {
                                newCheckBlueprints.push(check);
                            }
                            setCheckBlueprints(newCheckBlueprints);
                            if (!user) {
                                toast.error(
                                    "You must be logged in to create/update a check",
                                );
                                setSubmittingState(
                                    SubmittingState.NotSubmitting,
                                );
                                return;
                            }
                            const checker = {
                                name,
                                desc,
                                checkBlueprints: newCheckBlueprints,
                                creatorId: user.uid,
                            } as CheckerBlueprint;

                            // const checkerId =
                            //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
                            setSubmittingState(SubmittingState.Submitting);
                            (async () => {
                                await Api.createChecker(
                                    checker,
                                    checkerId,
                                    await user.getIdToken(),
                                );
                                setSubmittingState(SubmittingState.Submitted);
                                setTimeout(() => {
                                    setSubmittingState(
                                        SubmittingState.NotSubmitting,
                                    );
                                }, 3000);
                            })();
                        }}
                        setPage={setPage}
                        pageData={pageData}
                    />
                )}
            </div>
        </div>
    );
};

interface Props {
    name: string;
    setName: SetState<string>;
    desc: string;
    setDesc: SetState<string>;
    checkerId: string;
    checkBlueprints: CheckBlueprint[];
    setCheckBlueprints: SetState<CheckBlueprint[]>;
    setPage: (page: Page, pageData?: unknown) => void;
}

const SubmitButtonText = {
    [SubmittingState.NotSubmitting]: "Create Checker",
    [SubmittingState.Submitting]: "Creating Checker",
    [SubmittingState.Submitted]: "Checker Created!",
};

const MainCheckerPage = ({
    name,
    setName,
    desc,
    setDesc,
    checkerId,
    checkBlueprints,
    setCheckBlueprints,
    setPage,
}: Props) => {
    const [err, setErr] = React.useState("");
    const [clickedSubmit, setClickedSubmit] = React.useState(false);
    const [submittingState, setSubmittingState] = React.useState(
        SubmittingState.NotSubmitting,
    );

    const { user } = useClientContext();
    const router = useRouter();

    const getIncompleteFormErr = useCallback(() => {
        if (name === "") {
            return "Please enter a name";
        } else if (desc === "") {
            return "Please enter a description";
        } else if (checkBlueprints.length === 0) {
            return "Please enter at least one check";
        } else {
            return "";
        }
    }, [name, desc, checkBlueprints]);

    useEffect(() => {
        if (!clickedSubmit) {
            return;
        }
        setErr(getIncompleteFormErr());
    }, [getIncompleteFormErr, clickedSubmit]);

    const submitChecker = useCallback(() => {
        setClickedSubmit(true);
        if (getIncompleteFormErr() !== "") {
            return;
        }
        if (!user) {
            toast.error("You must be logged in to create a checker");
            return;
        }

        const checker = {
            name,
            desc,
            checkBlueprints,
            // id: crypto.randomBytes(32).toString("hex"), // TODO: I can save spacei f I don't storethis
            creatorId: user.uid,
        } as CheckerBlueprint;

        // const checkerId =
        //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
        setSubmittingState(SubmittingState.Submitting);
        (async () => {
            await Api.createChecker(
                checker,
                checkerId,
                await user.getIdToken(),
            );
            setSubmittingState(SubmittingState.Submitted);
            setTimeout(() => {
                setSubmittingState(SubmittingState.NotSubmitting);
            }, 3000);
        })();
    }, [name, desc, checkBlueprints, user, checkerId]);

    return (
        <div className="flex flex-col w-[450px]">
            <div className="flex flex-row items-center">
                <p
                    className="text-gray-400 cursor-pointer  transition duration-300 hover:text-gray-600"
                    onClick={() => {
                        router.push("/dashboard");
                    }}
                >
                    Dashboard
                </p>
                <RightArrowIcon className="mx-2 w-[14px]" />
                <p className="font-bold text-gray-600">Create checker</p>
            </div>

            <h1 className="text-xl font-bold mt-10">Create Checker</h1>

            <label className="text-lg">Name</label>
            <Input
                placeholder="Rizzume"
                onChange={(e) => {
                    setName(e.target.value);
                }}
                value={name}
            />

            <label className="text-lg">Description</label>
            <NormalTextArea
                placeholder="Rizzume will rizz up your resume to dazzle any employer. It will make points sharp and salient. All to make you sound impressive."
                onChange={(e) => {
                    setDesc(e.target.value);
                }}
                value={desc}
                minRows={3}
            />

            <div className="flex flex-row mt-2">
                <h1 className="font-bold text-xl mt-4">Checks</h1>
                <HelpIcon
                    className="mt-[22px] ml-2"
                    text={
                        "These are the individual checks your checker runs on the document. "
                    }
                />
            </div>
            <div>
                {checkBlueprints.map((checkBlueprint, idx) => (
                    <CheckOverview
                        key={`check-${idx}`}
                        checkBlueprint={checkBlueprint}
                        onDelete={() => {
                            const newChecks = [...checkBlueprints];
                            newChecks.splice(idx, 1);
                            setCheckBlueprints(newChecks);
                        }}
                        onEdit={() => {
                            setPage(Page.CheckCreator, {
                                initialCheckBlueprint: checkBlueprint,
                            });
                        }}
                    />
                ))}
            </div>
            <NormalButton
                className="mt-4 w-80"
                onClick={() => {
                    setPage(Page.CheckCreator);
                }}
            >
                Create Check
            </NormalButton>

            <div className="text-[#ff0000] mt-4 ">{err}</div>
            <LoadingButtonSubmit
                isLoading={submittingState === SubmittingState.Submitting}
                onClick={submitChecker}
                className="mt-4 w-80 h-10"
            >
                {SubmitButtonText[submittingState]}
            </LoadingButtonSubmit>
            <div className="h-10"></div>
        </div>
    );
};
