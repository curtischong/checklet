import { TextButton } from "@components/Button";
import { CheckBlueprint } from "@components/create-checker/CheckerTypes";

interface Props {
    checkBlueprint: CheckBlueprint;
    onDelete: () => void;
    onEdit: () => void;
}

export const CheckOverview = ({
    checkBlueprint,
    onDelete,
    onEdit,
}: Props): JSX.Element => {
    return (
        <div className="border bg-white rounded-md w-60">
            <div className="flex flex-row items-end">
                <div className="text-lg font-bold">{checkBlueprint.name}</div>
                <div className="ml-2">{checkBlueprint.category}</div>
            </div>
            <h2>{checkBlueprint.instruction}</h2>
            <h2>{checkBlueprint.longDesc}</h2>
            <h2>Positive Examples</h2>
            <div className="flex flex-col">
                {/* TODO: do a diff, so we see the red deletion / green insertion */}
                {checkBlueprint.positiveExamples.map((example, idx) => (
                    <div className="flex flex-row" key={`example-${idx}`}>
                        <h6>{example.originalText}</h6>
                        <h6>{example.editedText}</h6>
                    </div>
                ))}
            </div>
            <TextButton onClick={onEdit}>Edit</TextButton>
            <TextButton onClick={onDelete}>Delete</TextButton>
        </div>
    );
};
