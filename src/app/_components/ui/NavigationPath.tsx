import { RightArrowIcon } from "@/app/_components/icons/RightArrowIcon";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import React from "react";

export type LinkSection = {
  name: string;
  url?: string;
};

interface Props {
  sections: LinkSection[];
}

export const NavigationPath = ({ sections }: Props): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center">
      {sections.map((section, index) => {
        const isLastSection = index === sections.length - 1;
        return (
          <React.Fragment key={`${section.name}${index}`}>
            <p
              className={classNames({
                "cursor-pointer text-gray-400 transition duration-300 hover:text-gray-600":
                  !isLastSection,
                "cursor-normal font-bold text-gray-600": isLastSection,
              })}
              onClick={() => {
                if (!section.url) return;
                router.push(section.url);
              }}
            >
              {section.name}
            </p>
            {!isLastSection && <RightArrowIcon className="mx-2 w-[14px]" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
