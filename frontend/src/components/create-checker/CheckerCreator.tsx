import { Button, SubmitButton } from "@components/Button";
import { CheckBlueprint, CheckDisplay } from "@components/create-checker/Check";
import { CheckCreator } from "@components/create-checker/CheckCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { Input } from "antd";
import React, { useEffect } from "react";
import { downloadTextFile } from "util/download";

export type CheckerBlueprint = {
    name: string;
    checkBlueprints: CheckBlueprint[];
};

export const CheckerCreator: React.FC = () => {
    const [name, setName] = React.useState("");
    const [checkBlueprints, setCheckBlueprints] = React.useState<
        CheckBlueprint[]
    >([]);

    const [err, setErr] = React.useState("");
    useEffect(() => {
        if (name === "") {
            setErr("Please enter a name");
        } else if (checkBlueprints.length === 0) {
            setErr("Please enter at least one check");
        } else {
            setErr("");
        }
    }, [name, checkBlueprints]);

    return (
        <div className="flex justify-center ">
            <div className="container">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">Create Checker</h1>

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
                            <CheckDisplay
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

                    <CheckCreator
                        onCreate={(check) => {
                            setCheckBlueprints([...checkBlueprints, check]);
                        }}
                    />

                    <div className="text-[#ff0000] bg-white px-2 mt-4 ">
                        {err}
                    </div>
                    <SubmitButton
                        onClick={() => {
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
            </div>
        </div>
    );
};
