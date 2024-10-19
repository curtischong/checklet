import { SetState } from "@/utils/types";
import { useState } from "react";

interface Props<T> {
  options: T[];
  onChange: (selected: T) => void;
  className?: string;
}

interface Dropdown<T> extends Props<T> {
  defaultSelected: T;
}

export const Dropdown = <T,>(props: Dropdown<T>) => {
  const [selected, setSelected] = useState<T>(props.defaultSelected);
  return (
    <DropdownWithoutState
      {...props}
      selected={selected}
      setSelected={setSelected}
    />
  );
};

interface DropdownWithoutStateProps<T> extends Props<T> {
  setSelected: SetState<T>;
  selected: T;
}

export const DropdownWithoutState = <T,>({
  options = [],
  onChange,
  selected,
  setSelected,
  className = "",
}: DropdownWithoutStateProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: T) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className={`relative w-64 ${className}`}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">
          {String(selected) ?? "select an option"}
        </span>
        <span
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <li
                key={String(option)}
                className={`cursor-pointer px-4 py-2 text-sm ${
                  selected === option
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleSelect(option)}
              >
                {String(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
