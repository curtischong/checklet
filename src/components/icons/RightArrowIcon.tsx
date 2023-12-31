// from https://icon-sets.iconify.design/icon-park/right/
export const RightArrowIcon = ({
    className = "",
}: {
    className?: string;
}): JSX.Element => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className={className}
        >
            <path
                fill="none"
                stroke="#333333"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="6"
                d="M19 12L31 24L19 36"
            />
        </svg>
    );
};
