import { HelpIcon } from "@components/icons/HelpIcon";
import classNames from "classnames";

interface Props {
    label: string;
    helpText: string;
    className?: string;
    helpIconClassName?: string;
}

export const LabelWithHelp = ({
    label,
    helpText,
    className,
    helpIconClassName = "",
}: Props): JSX.Element => {
    return (
        <div className={`flex flex-row ${className}`}>
            <label>{label}</label>
            <HelpIcon
                className={classNames("ml-2", helpIconClassName)}
                text={helpText}
            />
        </div>
    );
};
