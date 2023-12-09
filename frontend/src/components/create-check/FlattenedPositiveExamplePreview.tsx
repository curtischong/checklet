import { PlusButton } from "@components/Button";
import {
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { RightArrowWithTailIcon } from "@components/icons/RightArrowWithTailIcon";
import { Tooltip } from "antd";

export const FlattenedPositiveExamplePreview = ({
    example,
    checkType,
}: {
    example: PositiveCheckExample;
    checkType: CheckType;
}): JSX.Element => {
    return (
        <div className="flex flex-row">
            <div className="flex flex-col">
                {/* this is the Pilcrow symbol */}
                <div>{example.originalText.replaceAll("\n", "¶")}</div>
            </div>
            {checkType === CheckType.rephrase && example.editedText && (
                <>
                    <RightArrowWithTailIcon className="mx-4" />
                    {example.editedText.map((text, idx) => (
                        <div
                            className="flex flex-row"
                            key={`editedText-${idx}`}
                        >
                            <div className="flex flex-col">
                                <div>{text.replaceAll("\n", "¶")}</div>
                            </div>
                            <Tooltip
                                className="mt-[-1px]"
                                title="Add rephrase option. This teaches the model to generate multiple options"
                            >
                                <PlusButton />
                            </Tooltip>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};
