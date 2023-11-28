import { Button, NormalButton, SubmitButton } from "@components/Button";
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

export type CheckerBlueprint = {
    name: string;
    checkBlueprints: CheckBlueprint[];
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
                className="mt-4"
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

                    const checker = {
                        name,
                        checkBlueprints,
                    } as CheckerBlueprint;
                    downloadTextFile(
                        `${name.replaceAll(" ", "-")}.json`,
                        JSON.stringify(checker),
                    );
                }}
                className="mt-4"
            >
                Create Checker
            </SubmitButton>
            <div className="h-10"></div>
        </div>
    );
};
