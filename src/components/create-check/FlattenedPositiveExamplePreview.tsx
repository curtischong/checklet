import { MAX_POSITIVE_EX_EDITED_TEXT_LEN } from "@/constants";
import { CloseButton, PlusButton, TextButton } from "@components/Button";
import { NormalTextArea } from "@components/TextArea";
import {
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { RightArrowWithTailIcon } from "@components/icons/RightArrowWithTailIcon";
import { SetState } from "@utils/types";
import { Tooltip } from "antd/lib";
import { useState } from "react";
import { toast } from "react-toastify";

export const FlattenedPositiveExamplePreview = ({
    example,
    checkType,
    setPositiveExamples, // this is only here so when we change hte positive exampe, we update the preview card
    positiveExamples,
}: {
    example: PositiveCheckExample;
    checkType: CheckType;
    setPositiveExamples: SetState<PositiveCheckExample[]>;
    positiveExamples: PositiveCheckExample[];
}): JSX.Element => {
    const [isAddingRephrase, setIsAddingRephrase] = useState(false);
    const [rephraseOption, setRephraseOption] = useState("");
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex flex-col">
                    {/* this is the Pilcrow symbol */}
                    <div>{example.originalText.replaceAll("\n", "¶")}</div>
                </div>
                {checkType === CheckType.rephrase &&
                    example.editedText.length > 0 && (
                        <>
                            <RightArrowWithTailIcon className="mx-4" />
                            <div className="flex flex-row space-x-4">
                                {example.editedText.map((text, idx) => {
                                    const flattenedText = text.replaceAll(
                                        "\n",
                                        "¶",
                                    );
                                    if (text === "") {
                                        return (
                                            <div
                                                className="flex flex-row bg-[#f35769] px-2 pt-[1px] rounded-md text-white"
                                                key={`editedText-${idx}`}
                                            >
                                                {example.originalText}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            className="flex flex-row bg-[#189bf2] px-2 pt-[1px] text-white rounded-md"
                                            key={`editedText-${idx}`}
                                        >
                                            <div>{flattenedText}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Tooltip
                                className="mt-[-1px]"
                                title="Add rephrase option. This teaches the model to generate multiple options"
                            >
                                <PlusButton
                                    onClick={() => {
                                        setIsAddingRephrase(true);
                                    }}
                                />
                            </Tooltip>
                        </>
                    )}
            </div>
            {isAddingRephrase && (
                <div className="flex flex-row items-start space-x-0">
                    <NormalTextArea
                        value={rephraseOption}
                        onChange={(e) => setRephraseOption(e.target.value)}
                        placeholder={"Add rephrase option"}
                        minRows={1}
                        maxLength={MAX_POSITIVE_EX_EDITED_TEXT_LEN}
                    />
                    <CloseButton
                        className="mt-[7px] ml-2"
                        onClick={() => setIsAddingRephrase(false)}
                    />
                    <TextButton
                        className="w-48 mt-[5px] px-0 ml-[-20px]"
                        onClick={() => {
                            if (example.editedText.includes(rephraseOption)) {
                                toast.error(
                                    "This rephrase option already exists",
                                );
                                return;
                            }
                            example.editedText.push(rephraseOption);
                            setPositiveExamples([...positiveExamples]);
                            setRephraseOption("");
                            setIsAddingRephrase(false);
                        }}
                    >
                        Add Rephrase
                    </TextButton>
                </div>
            )}
        </div>
    );
};
