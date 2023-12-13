// Use this component if you want to have a button that opens a file dialog
// The contents of the file will be passed to the onFileUpload callback
import React, { ChangeEvent } from "react";

interface Props {
    onFileUpload: (fileText: string) => void;
    fileType?: string;
}
export const FileUpload: React.FC<Props> = ({ onFileUpload, fileType }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = handleFileRead;
            reader.readAsText(file);
        }
    };

    const handleFileRead = (event: ProgressEvent<FileReader>) => {
        const reader = event.target as FileReader;
        const fileText = reader.result as string;
        onFileUpload(fileText);
    };

    return (
        <div>
            <div
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="black" // Set the fill color here
                >
                    <path d="M4,6c0.28,0,0.53-0.11,0.71-0.29L7,3.41V11c0,0.55,0.45,1,1,1s1-0.45,1-1V3.41l2.29,2.29C11.47,5.89,11.72,6,12,6c0.55,0,1-0.45,1-1c0-0.28-0.11-0.53-0.29-0.71l-4-4C8.53,0.11,8.28,0,8,0S7.47,0.11,7.29,0.29l-4,4C3.11,4.47,3,4.72,3,5C3,5.55,3.45,6,4,6z M15,11c-0.55,0-1,0.45-1,1v2H2v-2c0-0.55-0.45-1-1-1s-1,0.45-1,1v3c0,0.55,0.45,1,1,1h14c0.55,0,1-0.45,1-1v-3C16,11.45,15.55,11,15,11z" />
                </svg>
            </div>
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept={fileType}
                onChange={handleFileChange}
            />
        </div>
    );
};
