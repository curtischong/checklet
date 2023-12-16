import { checkerCreatorMarginTop } from "@/components/create-checker/CheckerCreator";
import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { NormalButton } from "@components/Button";
import { CheckOverview } from "@components/create-checker/CheckOverview";
import {
    CheckBlueprint,
    CheckStatuses,
} from "@components/create-checker/CheckerTypes";
import { HelpIcon } from "@components/icons/HelpIcon";
import CoolChecklet from "@public/checklets/cool.svg";
import { useClientContext } from "@utils/ClientContext";
import { SetState } from "@utils/types";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
    setCheckBlueprints: SetState<CheckBlueprint[]>;
    checkBlueprints: CheckBlueprint[];
    checkerId: CheckerId;
    checkStatuses: CheckStatuses;
    setCheckStatuses: (newCs: CheckStatuses) => void;
}
export const YourChecks = ({
    setCheckBlueprints,
    checkBlueprints,
    checkerId,
    checkStatuses,
    setCheckStatuses,
}: Props): JSX.Element => {
    const router = useRouter();
    const { user } = useClientContext();
    return (
        <div
            className="flex-grow no-scrollbar bg-gradient-to-b "
            style={{
                flexBasis: "0",
                overflowY: "scroll",
                height: `calc(100vh - ${checkerCreatorMarginTop}px)`,
                top: 0,
            }}
        >
            <div className="flex flex-col ml-20">
                <div className="flex flex-row mt-24 w-full">
                    <h1 className="font-bold text-lg mt-4 ml-1 font-mackinac">
                        Checks
                    </h1>
                    <HelpIcon
                        className="mt-[22px] ml-2"
                        text={
                            "These are the individual checks your checker runs on the document. "
                        }
                    />
                </div>
                <div className="mt-2 space-y-4 mb-12">
                    {checkBlueprints.map((checkBlueprint, idx) => (
                        <CheckOverview
                            key={`check-${idx}`}
                            checkerId={checkerId}
                            checkBlueprint={checkBlueprint}
                            checkStatuses={checkStatuses}
                            setCheckStatuses={setCheckStatuses}
                            onDelete={async () => {
                                if (!user) {
                                    return;
                                }
                                const checkId = checkBlueprint.objInfo.id;
                                if (
                                    !(await Api.deleteCheck(
                                        checkerId,
                                        checkId,
                                        user,
                                    ))
                                ) {
                                    return;
                                }
                                const newChecks = [...checkBlueprints];
                                newChecks.splice(idx, 1);
                                setCheckBlueprints(newChecks);
                                delete checkStatuses[checkId];
                                setCheckStatuses(checkStatuses);
                            }}
                            onEdit={() => {
                                router.push({
                                    pathname: `/create/check/${checkBlueprint.objInfo.id}`,
                                    query: {
                                        checkerId: checkerId,
                                    },
                                });
                            }}
                        />
                    ))}
                </div>

                <div>
                    {checkBlueprints.length === 0 && (
                        <div>
                            <Image
                                alt="CoolChecklet"
                                src={CoolChecklet.src}
                                width={100}
                                height={200}
                                className="right-0 ml-40 mb-10"
                            />
                            <div className="text-gray-400 ml-32">
                                You have no checks
                            </div>
                        </div>
                    )}
                </div>
                <NormalButton
                    className="w-80 ml-10 mt-4"
                    onClick={() => {
                        (async () => {
                            router.push({
                                pathname: `/create/check`,
                                query: {
                                    checkerId: checkerId,
                                },
                            });
                        })();
                    }}
                >
                    Create Check
                </NormalButton>
                <div className="h-32"></div>
            </div>
        </div>
    );
};
