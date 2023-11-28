import { TrashIcon } from "@components/icons/TrashIcon";
import { Button } from "antd";
import React from "react";

export type IButton = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export const NormalButton: React.FC<IButton> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <button
            className={`bg-white hover:bg-[#5384d4] text-gray-600 border border-gray-300 hover:text-white py-2 px-4 rounded transition duration-300 ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export const LoadingButton: React.FC<IButton & { loading: boolean }> = ({
    className = "",
    children,
    loading,
    ...rest
}) => {
    delete rest.type;
    return (
        <>
            <Button
                className={`bg-white hover:bg-[#5384d4] text-gray-600 border border-gray-300 hover:text-white px-4 rounded transition duration-300 ${className}`}
                {...rest}
                loading={loading}
                ref={undefined}
                type="text"
            >
                {children}
            </Button>
        </>
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

export const DeleteButton: React.FC<IButton> = ({
    className = "",
    ...rest
}) => {
    return (
        <div className="flex items-center">
            <button
                className={` hover:bg-red-600 text-gray hover:text-white px-[4px] py-[4px] mx-[10px] rounded transition duration-300 ${className}`}
                {...rest}
            >
                <TrashIcon />
            </button>
        </div>
    );
};
