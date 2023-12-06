import { Api } from "@api/apis";
import { CheckerStorefront } from "@components/create-checker/CheckerTypes";
import { useClientContext } from "@utils/ClientContext";
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
        <div>
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
}

const StoreFront = ({ storefront }: StorefrontProps) => {
    const router = useRouter();
    return (
        <div
            className="bg-white rounded-md w-60 px-4 py-4 cursor-pointer"
            onClick={() => {
                router.push(`/editor/${storefront.objInfo.id}`);
            }}
        >
            <div className="text-xl font-bold">{storefront.objInfo.name}</div>
            <div>{storefront.objInfo.desc}</div>
        </div>
    );
};
