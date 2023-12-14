import classNames from "classnames";
import Link from "next/link";

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
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
        </div>
    );
};
