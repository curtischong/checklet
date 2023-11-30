import { TrashIcon } from "@components/icons/TrashIcon";
import { Button, Upload } from "antd";
import classnames from "classnames";
import React, { useCallback } from "react";
import { UploadIcon } from "@components/icons/UploadIcon";

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

export const UploadButton = (): JSX.Element => {
    const beforeFileUpload = useCallback((file: any) => {
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            const content = event.target.result;
            const parseStrategy = getParseStrategy(file);
            const text = await parseStrategy(content);
            props.updateEditorState(
                EditorState.createWithContent(
                    ContentState.createFromText(text),
                    this.decorator(),
                ),
            );
        };
        reader.readAsBinaryString(file);

        return false;
    }, []);

    // todo: apply these styles:
    //
    // @media all and (min-width: 0px) and (max-width: 640px) {
    // .uploadButton {
    //     height: 30px;
    //     width: 125px;
    //     font-size: 12px;
    //     padding-left: 10px;
    //     margin-bottom: 10px;
    //     margin-top: 10px;
    // }

    // .upload {
    //     padding-left: 0;
    // }

    return (
        <Upload
            className={classnames("fl-2")}
            accept=".pdf,.docx"
            beforeUpload={beforeFileUpload}
            showUploadList={false}
        >
            <Button
                className={classnames("flex flex-row w-[150px] h-[36px]")}
                icon={
                    <UploadIcon className="relative mr-[10px] ml-[6px] w-[18px] mt-[1px]" />
                }
            >
                <span className="mt-[2px]">Upload PDF </span>
            </Button>
        </Upload>
    );
};
