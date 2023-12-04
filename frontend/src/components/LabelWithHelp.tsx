import { HelpIcon } from "@components/icons/HelpIcon";

interface Props {
    label: string;
    helpText: string;
    className?: string;
}

export const LabelWithHelp = ({
    label,
    helpText,
    className,
}: Props): JSX.Element => {
    return (
        <div className={`flex flex-row ${className}`}>
            <label>{label}</label>
            <HelpIcon className="mt-[3px] ml-1" text={helpText} />
        </div>
    );
};
