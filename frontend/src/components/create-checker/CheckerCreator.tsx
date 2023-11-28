import { Button, SubmitButton } from "@components/Button";
import { Check, CheckDisplay } from "@components/create-checker/Check";
import { CheckCreator } from "@components/create-checker/CheckCreator";
import { Input } from "antd";
import React from "react";
import { downloadTextFile } from "util/download";

type Checker = {
    name: string;
    checks: Check[];
};

export const CheckerCreator: React.FC = () => {
    const [name, setName] = React.useState("");
    const [checks, setChecks] = React.useState<Check[]>([]);

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

                    <h1 className="font-bold text-xl mt-4">Your Checks</h1>
                    <div>
                        {checks.map((check, idx) => (
                            <CheckDisplay key={`check-${idx}`} check={check} />
                        ))}
                    </div>

                    <CheckCreator
                        onCreate={(check) => {
                            setChecks([...checks, check]);
                        }}
                    />

                    <SubmitButton
                        onClick={() => {
                            const checker = {
                                name,
                                checks: [], // todo: populate
                            } as Checker;
                            downloadTextFile(
                                JSON.stringify(checker),
                                `${name.replaceAll(" ", "-")}.json`,
                            );
                        }}
                    >
                        Create Checker
                    </SubmitButton>
                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
};
