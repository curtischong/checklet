import { Check, CheckDisplay } from "@components/create-checker/Check";
import { Input } from "antd";
import React, { useEffect } from "react";

type Checker = {
    name: string;
    checks: Check[];
};

export const CheckCreator: React.FC = () => {
    const [checker, setChecker] = React.useState<Checker>();
    const [checks, setChecks] = React.useState<Check[]>([]);

    return (
        <div className="flex justify-center ">
            <div className="container">
                <div className="flex flex-col">
                    <h1>Create Checker</h1>
                    <Input className="w-40" placeholder="Checker Name" />

                    <h1>Your Checks</h1>
                    <div>
                        {checks.map((check, idx) => (
                            <CheckDisplay key={`check-${idx}`} check={check} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
