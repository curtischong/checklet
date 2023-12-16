// https://icon-sets.iconify.design/iconamoon/close-bold/

export const CloseIcon = ({
    className = "",
}: {
    className?: string;
}): JSX.Element => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="m7 7l10 10M7 17L17 7"
            />
        </svg>
    );
};
