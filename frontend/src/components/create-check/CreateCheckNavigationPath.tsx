import { RightArrowIcon } from "@components/icons/RightArrowIcon";
import classNames from "classnames";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";

export type LinkSection = {
    name: string;
    url?: string;
    query?: () => ParsedUrlQuery;
};

interface Props {
    sections: LinkSection[];
}

export const CreateCheckNavigationPath = ({ sections }: Props): JSX.Element => {
    const router = useRouter();

    return (
        <div className="flex flex-row items-center">
            {sections.map((section, index) => {
                const isLastSection = index === sections.length - 1;
                return (
                    <React.Fragment key={index}>
                        <p
                            className={classNames({
                                "text-gray-400 hover:text-gray-600 cursor-pointer transition duration-300":
                                    !isLastSection,
                                "text-gray-600 font-bold cursor-normal":
                                    isLastSection,
                            })}
                            onClick={() => {
                                if (!section.url) return;
                                router.push(
                                    section.url,
                                    section.query ? section.query() : undefined,
                                );
                            }}
                        >
                            {section.name}
                        </p>
                        {!isLastSection && (
                            <RightArrowIcon className="mx-2 w-[14px]" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
