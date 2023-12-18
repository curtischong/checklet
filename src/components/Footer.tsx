import classNames from "classnames";
import Link from "next/link";

interface Props {
    isAbsolute: boolean;
}

export const Footer = ({ isAbsolute }: Props) => {
    return (
        <div
            className={classNames(
                "bg-[#f7b7b8] w-full py-4 mt-10 flex flex-row gap-x-8 gap-y-3 justify-center bottom-0 flex-wrap",
                {
                    absolute: isAbsolute,
                },
            )}
        >
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <div>curtischong5@gmail.com</div>
            {/* <Link href="https://github.com/curtischong/checklet">
                <GithubIcon className="cursor-pointer" />
            </Link> */}
        </div>
    );
};
