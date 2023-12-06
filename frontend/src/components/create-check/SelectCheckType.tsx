import { SubmitButton } from "@components/Button";
import { SlidingRadioButton } from "@components/SlidingRadioButton";
import { CheckPreview } from "@components/create-check/CheckPreview";
import { CreateCheckNavigationPath } from "@components/create-check/CreateCheckNavigationPath";
import { CheckType } from "@components/create-checker/CheckerTypes";
import { SetState } from "@utils/types";
import React from "react";

interface SelectCheckTypeProps {
    setCheckType: SetState<CheckType | undefined>;
    setPage: (page: Page, pageData?: unknown) => void;
}

export const SelectCheckType = ({
    setCheckType,
    setPage,
}: SelectCheckTypeProps): JSX.Element => {
    const [tmpCheckType, setTmpCheckType] = React.useState<CheckType>(
        CheckType.highlight,
    );

    return (
        <div className="flex flex-col">
            <CreateCheckNavigationPath setPage={setPage} />
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
                            name: "",
                            desc: "",
                            instruction: "",
                            category: "",
                            checkId: "",
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
