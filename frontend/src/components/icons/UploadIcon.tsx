// https://icon-sets.iconify.design/mynaui/upload/

export const UploadIcon = ({
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16.004V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-8-.5v-11M15.5 8L12 4.5L8.5 8"
            />
        </svg>
    );
};
