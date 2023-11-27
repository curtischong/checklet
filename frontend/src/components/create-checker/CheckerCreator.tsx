import { Button } from "@components/button";
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
                    <h1>Create Checker</h1>

                    <label>Name</label>
                    <Input
                        className="w-40"
                        placeholder="Rizzume"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        value={name}
                    />

                    <CheckCreator
                        onCreate={(check) => {
                            setChecks([...checks, check]);
                        }}
                    />

                    <h1>Your Checks</h1>
                    <div>
                        {checks.map((check, idx) => (
                            <CheckDisplay key={`check-${idx}`} check={check} />
                        ))}
                    </div>

                    <Button
                        onClick={() => {
                            downloadTextFile(
                                JSON.stringify({ name, checks }),
                                `${name.replaceAll(" ", "-")}.json`,
                            );
                        }}
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
};
