import React from "react";
import { useRouter } from "next/router";
import { CheckCreator } from "@components/create-check/CheckCreator";

const CreateCheckWithIdPage: React.FC = () => {
    const router = useRouter();
    const checkId = router.query.checkId as string;

    // useEffect(() => {
    //     (async () => {})();
    // }, [checkerId]); // if the checkerId changes, we need to re-fetch the storefront (this page technically doesn't reload, so we need to add it to the dep lsit)

    return <CheckCreator checkId={checkId} />;
};

export default CreateCheckWithIdPage;
