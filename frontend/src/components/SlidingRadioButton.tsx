import { SetState } from "@utils/types";
import classNames from "classnames";

interface Props<Option = string> {
    options: Option[];
    selected: Option;
    setSelected: SetState<Option>;
}
export const SlidingRadioButton = ({
    options,
    selected,
    setSelected,
}: Props): JSX.Element => {
    return (
        <div className="flex flex-row space-x-1 p-1">
            {options.map((option, idx) => {
                return (
                    <div
                        key={`sliding-radio-${idx}`}
                        onClick={() => setSelected(option)}
                        className={classNames(
                            "px-2 py-1 rounded-md cursor-pointer select-none transition duration-300 text-sm",
                            {
                                "bg-[#dadada]": selected === option,
                                "hover:bg-[#e6e6e6]": selected !== option,
                            },
                        )}
                    >
                        {option}
                    </div>
                );
            })}
        </div>
    );
};
