"use client";
import { CloseIcon } from "@/app/_components/icons/CloseIcon";
import { EditIcon } from "@/app/_components/icons/EditIcon";
import { LinkArrowIcon } from "@/app/_components/icons/LinkArrowIcon";
import { PlusIcon } from "@/app/_components/icons/PlusIcon";
import { TrashIcon } from "@/app/_components/icons/TrashIcon";
import Popconfirm from "@/app/_components/ui/PopConfirm";
import classNames from "classnames";
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
      className={classNames(
        `rounded border border-gray-400 px-4 py-2 text-gray-600 transition duration-300 ${className}`,
        {
          // we need to specify these focus styles because antd's styles makes the button transparent
          "hover:bg-[#5384d4] hover:text-white focus:bg-[#43b56c] focus:text-white":
            !rest.disabled,
          "cursor-not-allowed bg-[#dddddd] focus:bg-[#999999]": rest.disabled,
        },
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading = false, disabled, className = "", ...props }, ref) => {
    return (
      <button
        className={`relative inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        disabled={disabled ?? loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <span className="absolute left-3 flex items-center">
            <svg
              className="h-5 w-5 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </span>
        )}
        <span className={`${loading ? "opacity-0" : "opacity-100"}`}>
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

interface LoadingButtonProps extends IButton {
  loading: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  className = "",
  children,
  loading,
  disabled,
  ...rest
}) => {
  const isDisabled = loading || disabled;

  return (
    <Button
      className={classNames(
        "rounded border border-gray-400 px-4 py-2 text-white transition duration-300",
        className,
        {
          "bg-confirm hover:bg-confirm2 hover:text-white": !isDisabled,
          "cursor-not-allowed bg-gray-300 focus:bg-gray-400": isDisabled,
        },
      )}
      loading={loading}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </Button>
  );
};
export const LoadingButtonSubmit: React.FC<
  IButton & { isLoading: boolean }
> = ({ className = "", children, isLoading, ...rest }) => {
  delete rest.type;
  return (
    <>
      <Button
        className={classNames(
          `rounded px-4 text-white transition duration-300 hover:text-white ${className}`,
          {
            // we need to specify these focus styles because antd's styles makes the button transparent
            "bg-[#43b56c] hover:bg-[#3a9e5e] focus:bg-[#43b56c] focus:text-white":
              !rest.disabled,
            "cursor-not-allowed bg-[#999999] focus:bg-[#999999]": rest.disabled,
          },
        )}
        {...rest}
        loading={isLoading}
        ref={undefined}
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
      className={classNames(
        `rounded px-4 py-2 text-white transition duration-300 ${className}`,
        {
          "bg-[#43b56c] hover:bg-[#3a9e5e]": !rest.disabled,
          "cursor-not-allowed bg-[#999999]": rest.disabled,
        },
      )}
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
      className={`rounded py-2 text-gray-500 transition duration-300 hover:text-gray-800 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export const EditButton: React.FC<IButton> = ({ className = "", ...rest }) => {
  return (
    <div className="flex items-center">
      <button
        className={`text-gray mx-[2px] rounded px-[4px] py-[0px] transition duration-300 hover:bg-blue-600 hover:text-white ${className}`}
        {...rest}
      >
        <EditIcon className="w-[18px] py-0" />
      </button>
    </div>
  );
};

export const DeleteButton: React.FC<IButton> = ({
  className = "",
  ...rest
}) => {
  return (
    <div className="flex items-center">
      <button
        className={`text-gray mx-[10px] rounded px-[4px] py-[4px] transition duration-300 hover:bg-red-600 hover:text-white ${className}`}
        {...rest}
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export const DeleteButtonWithConfirm: React.FC<
  IButton & {
    onDelete: () => void;
  }
> = ({ onDelete, ...rest }) => {
  return (
    <Popconfirm
      title="Delete Checker?"
      onConfirm={onDelete}
      isDeleteConfirm={true}
    >
      <DeleteButton {...rest} />
    </Popconfirm>
  );
};

export const PlusButton: React.FC<IButton> = ({ className = "", ...rest }) => {
  return (
    <div className="flex items-center">
      <button
        className={`mx-[10px] rounded px-[4px] py-[4px] text-gray-400 transition duration-300 hover:text-gray-600 ${className}`}
        {...rest}
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export const CloseButton: React.FC<IButton> = ({ className = "", ...rest }) => {
  return (
    <div className="flex items-center">
      <button
        className={`mx-[10px] rounded px-[4px] py-[4px] text-gray-400 transition duration-300 hover:text-gray-600 ${className}`}
        {...rest}
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export const LinkButton: React.FC<
  IButton & {
    url: string;
  }
> = ({ className = "", children, url }) => {
  return (
    <a
      href={url}
      rel="noopener"
      // target="_blank"
      aria-label="Read research paper"
      className={classNames(
        "relative inline-block rounded-md border-[1px] border-gray-400 py-1 pl-5 pr-7 leading-[130%] tracking-normal text-zinc-700 transition duration-300 hover:border-[#639fff] hover:bg-[#639fff] hover:text-white",
        className,
      )}
      style={{
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <span className="flex items-center">
        <span className="text-xl">{children}</span>
        <LinkArrowIcon />
      </span>
    </a>
  );
};

// export const UploadButton = (): JSX.Element => {
//     const beforeFileUpload = useCallback((file: any) => {
//         const reader = new FileReader();

//         reader.onload = async (event: any) => {
//             const content = event.target.result;
//             const parseStrategy = getParseStrategy(file);
//             const text = await parseStrategy(content);
//             props.updateEditorState(
//                 EditorState.createWithContent(
//                     ContentState.createFromText(text),
//                     this.decorator(),
//                 ),
//             );
//         };
//         reader.readAsBinaryString(file);

//         return false;
//     }, []);

//     // todo: apply these styles:
//     //
//     // @media all and (min-width: 0px) and (max-width: 640px) {
//     // .uploadButton {
//     //     height: 30px;
//     //     width: 125px;
//     //     font-size: 12px;
//     //     padding-left: 10px;
//     //     margin-bottom: 10px;
//     //     margin-top: 10px;
//     // }

//     // .upload {
//     //     padding-left: 0;
//     // }

//     return (
//         <Upload
//             className={classnames("fl-2")}
//             accept=".pdf,.docx"
//             beforeUpload={beforeFileUpload}
//             showUploadList={false}
//         >
//             <Button
//                 className={classnames("flex flex-row w-[150px] h-[36px]")}
//                 icon={
//                     <UploadIcon className="relative mr-[10px] ml-[6px] w-[18px] mt-[1px]" />
//                 }
//             >
//                 <span className="mt-[2px]">Upload PDF </span>
//             </Button>
//         </Upload>
//     );
// };
