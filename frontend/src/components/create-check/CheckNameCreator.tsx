import { SubmitButton } from "@components/Button";
import { Input } from "@components/Input";
import { CreateCheckNavigationPath } from "@components/create-check/CreateCheckNavigationPath";
import { Page } from "@components/create-checker/CheckerCreator";
import { SetState } from "@utils/types";
import React from "react";

interface Props {
    setCheckName: SetState<string | undefined>;
    setPage: (page: Page, pageData?: unknown) => void;
}

export const CreateCheckName = ({ setCheckName, setPage }: Props) => {
    const [tmpName, setTmpName] = React.useState("");
    return (
        <div>
            <CreateCheckNavigationPath setPage={setPage} />
            <div className="w-[500px] mx-auto flex flex-col justify-center h-[80vh]">
                <div className="text-xl font-bold">Define your Check</div>
                <div className="mt-4 text-xl">Check Name</div>
                <div>
                    Great names are simple, succinct, and describe what you are
                    checking
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (tmpName !== "") {
                            setCheckName(tmpName);
                        }
                    }}
                >
                    <Input
                        placeholder="Shorten Months"
                        value={tmpName}
                        onChange={(e) => setTmpName(e.target.value)}
                        className="mt-4"
                    />
                </form>
                <SubmitButton
                    onClick={() => setCheckName(tmpName)}
                    className="mt-4 w-40"
                    disabled={tmpName === ""}
                >
                    Continue
                </SubmitButton>
            </div>
        </div>
    );
};
