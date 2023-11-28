import React from "react";

export type IButton = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export const Button: React.FC<IButton> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <button
            className={`py-2 px-4 rounded bg-green-500 hover:bg-green-600 focus:outline-none ring-opacity-75 ring-green-400 focus:ring text-white text-lg ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export const NormalButton: React.FC<IButton> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <button
            className={`bg-white hover:bg-[#5384d4] text-gray-600 border border-[#5384d4] hover:text-white py-2 px-4 rounded transition duration-300 ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export const SubmitButton: React.FC<IButton> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <button
            // className={`py-2 px-4 rounded duration-300 bg-white transition-transform transform hover:bg-blue-500 focus:outline-none ring-opacity-75 ring-blue-300 focus:ring text-black text-lg ${className}`}
            className={`bg-[#43b56c] hover:bg-[#3a9e5e] text-white py-2 px-4 rounded transition duration-300 ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

// this button only has text, no border
export const TextButton: React.FC<IButton> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <button
            className={` text-gray-700 hover:text-gray-800 py-2 px-4 rounded transition duration-300 ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};
