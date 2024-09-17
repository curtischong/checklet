// https://icon-sets.iconify.design/iconoir/sort-up/
export const SortIcon = ({
    className = "",
    onClick,
}: {
    className?: string;
    onClick?: () => void;
}): JSX.Element => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={className}
            onClick={onClick}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M14 14H2m8-4H2m4-4H2m16 12H2m17-4V4m0 0l3 3m-3-3l-3 3"
            />
        </svg>
    );
};
