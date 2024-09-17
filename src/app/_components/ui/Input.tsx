export type IInput = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
>;

export const Input: React.FC<IInput> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <input
            className={`bg-white p-1 my-1 text-gray-600 border border-gray-400 py-2 px-4 rounded ${className}`}
            {...rest}
            type="text"
        >
            {children}
        </input>
    );
};

export const SmallInput: React.FC<IInput> = ({
    className = "",
    children,
    ...rest
}) => {
    return (
        <input
            className={`bg-white py-[2px] my-1 text-gray-600 border border-gray-400 px-2 rounded ${className}`}
            {...rest}
            type="text"
        >
            {children}
        </input>
    );
};
