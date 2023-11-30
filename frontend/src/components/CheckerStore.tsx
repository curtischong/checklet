import { Api } from "@api/apis";
import { useClientContext } from "@utils/ClientContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface CheckerStorefront {
    id: string;
    name: string;
    desc: string;
    creatorId: string;
}

export const CheckerStore = () => {
    const { user } = useClientContext();
    const [storefronts, setStorefronts] = useState<CheckerStorefront[]>([]);
    useEffect(() => {
        (async () => {
            const newStorefronts = await Api.publicChecks();
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
                router.push(`/editor/${storefront.id}`);
            }}
        >
            <div className="text-xl font-bold">{storefront.name}</div>
            <div>{storefront.desc}</div>
        </div>
    );
};

// interface UserCheckersProps {
//     userId: string;
//     allStoreFronts
// }

// export const UserCheckers = () => {

// }
