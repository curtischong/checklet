import { SubmitButton } from "@components/Button";
import { SlidingRadioButton } from "@components/SlidingRadioButton";
import { CheckPreview } from "@components/create-check/CheckPreview";
import { NavigationPath } from "@components/NavigationPath";
import { feedbackTypeDesc } from "@components/create-check/DefaultTextForCheckType";
import {
    CheckType,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { SetState } from "@utils/types";
import React from "react";
import { useRouter } from "next/router";

interface SelectCheckTypeProps {
    setCheckType: SetState<CheckType | undefined>;
}

export const SelectCheckType = ({
    setCheckType,
}: SelectCheckTypeProps): JSX.Element => {
    const [tmpCheckType, setTmpCheckType] = React.useState<CheckType>(
        CheckType.highlight,
    );
    const router = useRouter();
    const checkerId = router.query.checkerId as string;

    return (
        <div className="flex flex-col">
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
            <div className="w-[50vw] mx-auto flex flex-col">
                <div className="mt-16 font-bold text-xl">Select Check Type</div>
                <SlidingRadioButton
                    options={validCheckTypes}
                    selected={tmpCheckType}
                    setSelected={setTmpCheckType as SetState<string>}
                    className="mt-10 mx-auto "
                />
                <div className="w-[400px] mx-auto mt-8 h-48">
                    <CheckPreview
                        blueprint={{
                            objInfo: {
                                id: "",
                                name: "",
                                desc: "",
                                creatorId: "",
                            },
                            instruction: "",
                            category: "",
                            checkType: tmpCheckType,
                            positiveExamples: [],
                        }}
                        originalText=""
                        editedText=""
                    />
                </div>
                <div className="flex flex-col mb-10 ml-1">
                    <div className=" flex flex-row">
                        <div className="font-bold text-lg">
                            {tmpCheckType} Check
                        </div>
                    </div>
                    <div className="mt-2">{feedbackTypeDesc(tmpCheckType)}</div>
                </div>
                <SubmitButton
                    onClick={() => setCheckType(tmpCheckType)}
                    className="w-[300px] mx-auto"
                >
                    Create {tmpCheckType} Check
                </SubmitButton>
            </div>
        </div>
    );
};
