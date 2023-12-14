import { Api } from "@api/apis";
import { CheckerStorefront } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// TODO: show user checkers and public checkers separately?
export const CheckerStore = (): JSX.Element => {
    const { user } = useClientContext();
    const [storefronts, setStorefronts] = useState<CheckerStorefront[]>([]);
    useEffect(() => {
        (async () => {
            const newStorefronts = await Api.getPublicCheckers(
                user, // if you're not logged in, then don't pass in an ID token! The token is just used so you can see your private checkers
            );
            if (newStorefronts) {
                setStorefronts(newStorefronts);
            }
        })();
    }, []);

    return (
        <div className="flex flex-col items-center mt-10 space-y-4">
            {/* TODO: add a search bar */}
            {storefronts.map((storefront, idx) => {
                return (
                    <div key={`storefront-${idx}`}>
                        <StoreFront storefront={storefront} />
                    </div>
                );
            })}
        </div>
    );
};

interface StorefrontProps {
    storefront: CheckerStorefront;
    isDemo?: boolean;
}

export const StoreFront = ({ storefront, isDemo }: StorefrontProps) => {
    const router = useRouter();
    return (
        <div
            className={classNames(
                "bg-white rounded-md max-w-[350px] px-4 py-4  shadow-around text-left",
                {
                    "cursor-pointer": !isDemo,
                },
            )}
            onClick={() => {
                if (isDemo) return;
                router.push(`/editor/${storefront.objInfo.id}`);
            }}
        >
            <div className="text-xl font-bold mb-1 font-mackinac">
                {storefront.objInfo.name}
            </div>
            <div>{storefront.objInfo.desc}</div>
        </div>
    );
};
