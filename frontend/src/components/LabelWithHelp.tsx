import { HelpIcon } from "@components/icons/HelpIcon";

interface Props {
    label: string;
    helpText: string;
}

export const LabelWithHelp = ({ label, helpText }: Props): JSX.Element => {
    return (
        <div className="flex flex-row mt-2">
            <label>{label}</label>
            <HelpIcon className="mt-[3px] ml-1" text={helpText} />
        </div>
    );
};
