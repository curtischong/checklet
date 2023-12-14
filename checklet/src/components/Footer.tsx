import classNames from "classnames";

interface Props {
    isAbsolute: boolean;
}

export const Footer = ({ isAbsolute }: Props) => {
    return (
        <div
            className={classNames(
                "bg-[#f7b7b8] w-full py-4 mt-10 flex flex-row space-x-4 justify-center bottom-0",
                {
                    absolute: isAbsolute,
                },
            )}
        >
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
        </div>
    );
};
