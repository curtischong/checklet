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
            className={`bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 py-2 px-4 rounded transition duration-300 ${className}`}
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
            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};
