export type ITextArea = React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
>;

export const TextArea: React.FC<ITextArea> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <textarea
            className={`bg-gray-100 p-1 my-1 text-gray-600 border border-[#5384d4] py-2 px-4 rounded ${className}`}
            {...rest}
        >
            {children}
        </textarea>
    );
};
