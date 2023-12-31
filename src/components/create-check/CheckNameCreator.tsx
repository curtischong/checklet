import { SubmitButton } from "@components/Button";
import { Input } from "@components/Input";
import { NavigationPath } from "@components/NavigationPath";
import { SetState } from "@utils/types";
import { useRouter } from "next/router";
import React from "react";

interface Props {
    setCheckName: SetState<string>;
}

export const CreateCheckName = ({ setCheckName }: Props): JSX.Element => {
    const [tmpName, setTmpName] = React.useState("");
    const router = useRouter();
    const checkerId = router.query.checkerId as string;
    return (
        <div className="flex justify-center mt-[50px]">
            <div className="container">
                <NavigationPath
                    sections={[
                        {
                            name: "Dashboard",
                            url: "/dashboard",
                        },
                        {
                            name: "Create Checker",
                            url: `/create/checker/${checkerId}`,
                        },
                        {
                            name: "Create Check",
                        },
                    ]}
                />
                <div className="mx-auto flex flex-col justify-center mt-[25vh] w-[800px]">
                    {/* <div className="text-xl font-bold">Define your Check</div> */}
                    <div className="text-4xl font-bold font-mackinac">
                        Check Name
                    </div>
                    <div className="mt-4">
                        Great names are simple, succinct, and describe what you
                        are checking
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
                            className="mt-4 w-[50vw]"
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
        </div>
    );
};
