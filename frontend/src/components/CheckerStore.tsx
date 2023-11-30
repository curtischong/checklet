import { Api } from "@api/apis";
import { useClientContext } from "@utils/ClientContext";
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
                setStorefronts(storefronts);
            }
        })();
    }, []);

    return (
        <div>
            {storefronts.map((storefront) => {
                return (
                    <div>
                        <div>{storefront.name}</div>
                        <div>{storefront.desc}</div>
                    </div>
                );
            })}
        </div>
    );
};

// interface UserCheckersProps {
//     userId: string;
//     allStoreFronts
// }

// export const UserCheckers = () => {

// }
