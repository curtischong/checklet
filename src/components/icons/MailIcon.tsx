// https://icon-sets.iconify.design/tabler/mail/

export const MailIcon = ({
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
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            >
                <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="m3 7l9 6l9-6" />
            </g>
        </svg>
    );
};
