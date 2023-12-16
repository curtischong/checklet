import { LinkButton } from "@/components/Button";
import { Footer } from "@/components/Footer";

export const MustBeLoggedInMsg = ({
    isCheck,
}: {
    isCheck: boolean;
}): JSX.Element => {
    return (
        <>
            <div className="mx-auto text-center px-4">
                <div className="font-mackinac text-2xl mt-32">
                    You must be logged in the create a{" "}
                    {isCheck ? "check" : "checker"}
                </div>
                <div>
                    <LinkButton url="/login" className="mt-8">
                        Login here
                    </LinkButton>
                </div>
            </div>
            <Footer isAbsolute={true} />
        </>
    );
};
