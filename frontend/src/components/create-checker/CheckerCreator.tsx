import { Button, SubmitButton } from "@components/Button";
import { CheckBlueprint, CheckDisplay } from "@components/create-checker/Check";
import { CheckCreator } from "@components/create-checker/CheckCreator";
import { HelpIcon } from "@components/icons/HelpIcon";
import { Input } from "antd";
import React from "react";
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

                    <SubmitButton
                        onClick={() => {
                            const checker = {
                                name,
                                checkBlueprints: [], // todo: populate
                            } as CheckerBlueprint;
                            downloadTextFile(
                                JSON.stringify(checker),
                                `${name.replaceAll(" ", "-")}.json`,
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
