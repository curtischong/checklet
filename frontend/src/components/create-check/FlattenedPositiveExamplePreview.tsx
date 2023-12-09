import { CloseButton, PlusButton, TextButton } from "@components/Button";
import { NormalTextArea } from "@components/TextArea";
import {
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { RightArrowWithTailIcon } from "@components/icons/RightArrowWithTailIcon";
import { Tooltip } from "antd";
import { useState } from "react";
import { MAX_POSITIVE_EX_EDITED_TEXT_LEN } from "src/constants";

export const FlattenedPositiveExamplePreview = ({
    example,
    checkType,
}: {
    example: PositiveCheckExample;
    checkType: CheckType;
}): JSX.Element => {
    const [isAddingRephrase, setIsAddingRephrase] = useState(false);
    const [rephaseOption, setRephaseOption] = useState("");
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex flex-col">
                    {/* this is the Pilcrow symbol */}
                    <div>{example.originalText.replaceAll("\n", "¶")}</div>
                </div>
                {checkType === CheckType.rephrase && example.editedText && (
                    <>
                        <RightArrowWithTailIcon className="mx-4" />
                        <div className="flex flex-row space-x-4">
                            {example.editedText.map((text, idx) => (
                                <div
                                    className="flex flex-row bg-blue-100 px-2 pt-[1px] rounded-md"
                                    key={`editedText-${idx}`}
                                >
                                    <div className="flex flex-col">
                                        <div>{text.replaceAll("\n", "¶")}</div>
                                    </div>
                                </div>
                            ))}
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
                        value={rephaseOption}
                        onChange={(e) => setRephaseOption(e.target.value)}
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
                            example.editedText.push(rephaseOption);
                            setRephaseOption("");
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
