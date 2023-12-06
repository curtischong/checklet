import { RightArrowIcon } from "@components/icons/RightArrowIcon";
import { useRouter } from "next/router";

export const CreateCheckNavigationPath = (): JSX.Element => {
    const router = useRouter();
    const checkerId = router.query.checkerId;
    return (
        <div className="flex flex-row items-center">
            <p
                className="text-gray-400 cursor-pointer  transition duration-300 hover:text-gray-600"
                onClick={() => {
                    router.push("/dashboard");
                }}
            >
                Dashboard
            </p>
            <RightArrowIcon className="mx-2 w-[14px]" />
            <p
                className="text-gray-400 cursor-pointer  transition duration-300 hover:text-gray-600"
                onClick={() => {
                    // TODO: we need to have a function that will rout to the right path, but iwll also consider al lthe right url params
                    router.push(`/create/checker/${checkerId}`);
                }}
            >
                Create checker
            </p>
            <RightArrowIcon className="mx-2 w-[14px]" />
            <p className="font-bold text-gray-600">Create check</p>
        </div>
    );
};
