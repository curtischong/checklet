import classNames from "classnames";
import Link from "next/link";

interface Props {
  isAbsolute: boolean;
}

export const Footer = ({ isAbsolute }: Props) => {
  return (
    <div
      className={classNames(
        "bottom-0 mt-[30px] flex h-[55px] w-full flex-row flex-wrap justify-center gap-x-8 gap-y-3 bg-[#f7b7b8] py-4",
        {
          absolute: isAbsolute,
        },
      )}
    >
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/terms-of-service">Terms of Service</Link>
      <div>curtischong5@gmail.com</div>
      {/* <Link
                target="_blank"
                href="https://github.com/curtischong/checklet"
            >
                <GithubIcon className="cursor-pointer" />
            </Link> */}
    </div>
  );
};
