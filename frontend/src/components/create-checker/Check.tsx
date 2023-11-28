import { PositiveCheckExample } from "@components/create-checker/PositiveCheckExampleCreator";

export type Check = {
    name: string;
    instruction: string;
    longDesc: string;
    category: string | undefined;
    positiveExamples: PositiveCheckExample[];
    // negativeExamples: NegativeCheckExample[]; // TODO
};

interface Props {
    check: Check;
    onDelete: () => void;
}

export const CheckDisplay = ({ check, onDelete }: Props): JSX.Element => {
    return (
        <div>
            <h1>{check.name}</h1>
            <h2>{check.instruction}</h2>
            <h2>{check.longDesc}</h2>
            <h2>{check.category}</h2>
            <h2>Positive Examples</h2>
            <div className="flex flex-col">
                {/* TODO: do a diff, so we see the red deletion / green insertion */}
                {check.positiveExamples.map((example, idx) => (
                    <div key={`example-${idx}`}>
                        <h6>{example.originalText}</h6>
                        <h6>{example.editedText}</h6>
                    </div>
                ))}
            </div>
            <div onClick={onDelete}>Delete</div>
        </div>
    );
};
