import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { CheckOverview } from "@components/create-checker/CheckOverview";
import {
    CheckBlueprint,
    CheckStatuses,
} from "@components/create-checker/CheckerTypes";
import { HelpIcon } from "@components/icons/HelpIcon";
import { useClientContext } from "@utils/ClientContext";
import { SetState } from "@utils/types";
import { useRouter } from "next/router";

interface Props {
    setCheckBlueprints: SetState<CheckBlueprint[]>;
    checkBlueprints: CheckBlueprint[];
    checkerId: CheckerId;
    checkStatuses: CheckStatuses;
    setCheckStatuses: SetState<CheckStatuses>;
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
            className="flex-grow "
            style={{
                flexBasis: "0",
            }}
        >
            <div className="flex flex-col ml-20">
                <div className="flex flex-row mt-28 w-full">
                    <h1 className="font-bold text-lg mt-4 ml-1">Checks</h1>
                    <HelpIcon
                        className="mt-[22px] ml-2"
                        text={
                            "These are the individual checks your checker runs on the document. "
                        }
                    />
                </div>
                <div className="mt-2 space-y-4">
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
            </div>
        </div>
    );
};
