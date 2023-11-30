import { NormalButton, SubmitButton } from "@components/Button";
import {
    CheckBlueprint,
    CheckOverview,
} from "@components/create-checker/Check";
import { CheckCreator } from "@components/create-checker/CheckCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { SetState } from "@utils/types";
import { Input } from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { downloadTextFile } from "util/download";
import * as crypto from "crypto";
import { toast } from "react-toastify";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useClientContext } from "@utils/ClientContext";
import { Api } from "@api/apis";
import { RightArrowIcon } from "@components/icons/RightArrowIcon";

export type CheckerBlueprint = {
    name: string;
    checkBlueprints: CheckBlueprint[];
    id: string;
};
export enum Page {
    Main,
    CheckCreator,
}

export const CheckerCreator: React.FC = () => {
    const [name, setName] = React.useState("");
    const [checkBlueprints, setCheckBlueprints] = React.useState<
        CheckBlueprint[]
    >([]);

    // https://stackoverflow.com/questions/60036703/is-it-possible-to-define-hash-route-in-next-js
    const router = useRouter();
    const hash = router.asPath.split("#")[1] || "";
    const page = hash === "check" ? Page.CheckCreator : Page.Main;
    const setPage = (page: Page) => {
        if (page === Page.Main) {
            router.push("");
        } else {
            router.push("#check");
        }
    };

    return (
        <div className="flex justify-center ">
            <div className="container">
                {page === Page.Main ? (
                    <MainCheckerPage
                        name={name}
                        setName={setName}
                        checkBlueprints={checkBlueprints}
                        setCheckBlueprints={setCheckBlueprints}
                        setPage={setPage}
                    />
                ) : (
                    <CheckCreator
                        onCreate={(check) => {
                            setCheckBlueprints([...checkBlueprints, check]);
                            setPage(Page.Main);
                        }}
                        setPage={setPage}
                    />
                )}
            </div>
        </div>
    );
};

interface Props {
    name: string;
    setName: SetState<string>;
    checkBlueprints: CheckBlueprint[];
    setCheckBlueprints: SetState<CheckBlueprint[]>;
    setPage: (page: Page) => void;
}

const MainCheckerPage = ({
    name,
    setName,
    checkBlueprints,
    setCheckBlueprints,
    setPage,
}: Props) => {
    const [err, setErr] = React.useState("");
    const [clickedSubmit, setClickedSubmit] = React.useState(false);
    const { firestore, user } = useClientContext();
    const router = useRouter();

    const getIncompleteFormErr = useCallback(() => {
        if (name === "") {
            return "Please enter a name";
        } else if (checkBlueprints.length === 0) {
            return "Please enter at least one check";
        } else {
            return "";
        }
    }, [name, checkBlueprints]);

    useEffect(() => {
        if (!clickedSubmit) {
            return;
        }
        setErr(getIncompleteFormErr());
    }, [getIncompleteFormErr, clickedSubmit]);

    return (
        <div className="flex flex-col">
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
                className="w-40"
                placeholder="Rizzume"
                onChange={(e) => {
                    setName(e.target.value);
                }}
                value={name}
            />

            <div className="flex flex-row mt-2">
                <h1 className="font-bold text-xl mt-4">Your Checks</h1>
                <HelpIcon
                    className="mt-[22px] ml-2"
                    text={
                        "These are the individual checks your checker runs on the document. "
                    }
                />
            </div>
            <div>
                {checkBlueprints.map((check, idx) => (
                    <CheckOverview
                        key={`check-${idx}`}
                        checkBlueprint={check}
                        onDelete={() => {
                            const newChecks = [...checkBlueprints];
                            newChecks.splice(idx, 1);
                            setCheckBlueprints(newChecks);
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

            <div className="text-[#ff0000]  mt-4 ">{err}</div>
            <SubmitButton
                onClick={() => {
                    setClickedSubmit(true);
                    if (getIncompleteFormErr() !== "") {
                        return;
                    }
                    if (!user) {
                        toast.error(
                            "You must be logged in to create a checker",
                        );
                        return;
                    }

                    const checker = {
                        name,
                        checkBlueprints,
                        // id: crypto.randomBytes(32).toString("hex"), // TODO: I can save spacei f I don't storethis
                    } as CheckerBlueprint;
                    // downloadTextFile(
                    //     `${name.replaceAll(" ", "-")}.json`,
                    //     JSON.stringify(checker),
                    // );

                    const checkerId = crypto.randomBytes(32).toString("hex");
                    // const checkerId =
                    //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
                    (async () => {
                        Api.createChecker(
                            checker,
                            checkerId,
                            await user.getIdToken(),
                        );
                    })();
                    // try {
                    //     await setDoc(
                    //         doc(firestore, "checkers", checkerId),
                    //         {
                    //             blueprint: checker,
                    //             userId: user.uid, // since you are the person that sets it. I think it's fine. hackers can't set someone else's userId
                    //         },
                    //     );
                    //     console.log(
                    //         "Document written with ID: ",
                    //         checkerId,
                    //     );
                    //     // TODO: make the button a loader button and visualize success
                    // } catch (e) {
                    //     toast.error(`Error adding document: ${e}`);
                    // }
                }}
                className="mt-4 w-80"
            >
                Create Checker
            </SubmitButton>
            <div className="h-10"></div>
        </div>
    );
};
