export type Check = {
    name: string;
    // shortDesc: string;
    default: string | undefined;
    identifyPrompt: string;
    replacementPrompt: string;
    category: string | undefined;
};

interface Props {
    check: Check;
}

export const CheckDisplay = ({ check }: Props): JSX.Element => {
    return (
        <div>
            <h1>{check.name}</h1>
            {/* <h2>{check.shortDesc}</h2> */}
            <h3>{check.default}</h3>
            <h4>{check.identifyPrompt}</h4>
            <h5>{check.replacementPrompt}</h5>
        </div>
    );
};
