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
            className={`bg-gray-100 p-1 my-1 text-gray-600 border border-[#5384d4] py-2 px-4 rounded ${className}`}
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
            className={`bg-gray-100 py-[2px] my-1 text-gray-600 border border-[#5384d4] px-2 rounded ${className}`}
            {...rest}
            type="text"
        >
            {children}
        </input>
    );
};
