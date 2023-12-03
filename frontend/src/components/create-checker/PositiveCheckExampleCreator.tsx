import { TextButton } from "@components/Button";
import { CheckBox } from "@components/CheckBox";
import { TextArea } from "@components/TextArea";
import ThinLine from "@components/ThinLine";
import { PositiveCheckExample } from "@components/create-checker/CheckerTypes";
import { HelpIcon } from "@components/icons/HelpIcon";
import React from "react";

interface Props {
    onCreate: (example: PositiveCheckExample) => void;
}

// TODO: add negative check example creator
export const PositiveCheckExampleCreator = ({
    onCreate,
}: Props): JSX.Element => {
    const [originalText, setOriginalText] = React.useState("");
    const [editedText, setEditedText] = React.useState("");
    const [isRephrasing, setIsRephrasing] = React.useState(false);
    return (
        <div className="flex flex-col ">
            <ThinLine className="mt-4" />
            <div className="flex items-center ">
                <label className="text-md">Original Text</label>
                <HelpIcon
                    text="The model should follow your instructions when it sees this text"
                    className="ml-2 "
                />
            </div>
            <TextArea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="January"
                minHeight={10}
            />
            <div className="flex flex-row items-center">
                <CheckBox
                    label="Rephrase original text into:"
                    isChecked={isRephrasing}
                    setIsChecked={setIsRephrasing}
                />
                <HelpIcon
                    text="If you want to rephrase something, this will teach the model how to rephrase it"
                    className="ml-2 "
                />
            </div>
            <TextArea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Jan"
                minHeight={40}
                disabled={!isRephrasing}
            />
            <TextButton
                disabled={originalText === "" || editedText === ""}
                onClick={() => {
                    onCreate({
                        originalText,
                        isRephrasing,
                        editedText,
                    });
                    setOriginalText("");
                    setEditedText("");
                }}
            >
                Create
            </TextButton>
        </div>
    );
};
