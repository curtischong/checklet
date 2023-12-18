import {
    CheckBlueprint,
    CheckerStorefront,
} from "@components/create-checker/CheckerTypes";
import { useRouter } from "next/router";

interface Props {
    storefront: CheckerStorefront;
    onlyUseCheckBlueprint?: CheckBlueprint;
}

export const EditorHeader = ({
    storefront,
    onlyUseCheckBlueprint,
}: Props): JSX.Element => {
    const router = useRouter();

    return (
        <div>
            <div className="flex flex-col pt-[20px] mt-[20px]">
                <div className="flex flex-row">
                    <div className=" text-3xl my-auto flex-grow font-mackinac">
                        {storefront.objInfo.name}
                    </div>
                </div>
                <div className="text-md">
                    {onlyUseCheckBlueprint ? (
                        <>
                            <p>
                                You are testing the check:{" "}
                                <span className="font-bold">
                                    {onlyUseCheckBlueprint.objInfo.name}
                                </span>
                            </p>
                        </>
                    ) : (
                        <p>{storefront.objInfo.desc}</p>
                    )}
                </div>
            </div>
            <hr className="w-full h-[1px] bg-black mb-4 mt-1 border-none" />
        </div>
    );
};
