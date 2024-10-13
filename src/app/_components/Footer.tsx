import { Tooltip } from "@/app/_components/ui/ToolTip";
import Discord from "@public/logos/discord.svg";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <div
      className={classNames(
        "relative bottom-0 z-40 mt-[30px] flex min-h-[55px] w-full flex-row flex-wrap justify-center gap-x-8 gap-y-3 bg-[#f7b7b8] py-4",
      )}
    >
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/terms-of-service">Terms of Service</Link>
      <Link href="/about">About</Link>
      <div>curtischong5@gmail.com</div>
      <Tooltip title="Send feedback on Discord!">
        <Link target="_blank" href="https://discord.gg/Gx9jXq3BaC">
          <Image
            src={Discord as string}
            alt={`Discord logo`}
            className="mr-4 h-6 w-6"
            width={40}
            height={40}
          />
        </Link>
      </Tooltip>
    </div>
  );
};
