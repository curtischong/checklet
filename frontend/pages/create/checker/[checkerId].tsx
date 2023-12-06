import React from "react";
import { useRouter } from "next/router";
import { CheckerCreator } from "@components/create-checker/CheckerCreator";

const CreateCheckerPage: React.FC = () => {
    const router = useRouter();
    const checkerId = router.query.checkerId as string;

    // useEffect(() => {
    //     (async () => {})();
    // }, [checkerId]); // if the checkerId changes, we need to re-fetch the storefront (this page technically doesn't reload, so we need to add it to the dep lsit)

    return <CheckerCreator checkerId={checkerId} />;
};

export default CreateCheckerPage;
