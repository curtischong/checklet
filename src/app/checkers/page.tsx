import {
  LoveChecklet,
  PennyChecklet,
  SpacyChecklet,
} from "@/app/_components/checklets/checklets";
import { CheckerStore } from "@/app/checkers/CheckerStore";
import { CreateOwnChecker } from "@/app/checkers/CreateOwnChecker";
import { trackPageView } from "@/mixpanel";
import { parseAuthHeader } from "@/networking_helpers";

const Page = () => {
  const user = parseAuthHeader();
  trackPageView(user);

  return (
    <>
      <div className="container mx-auto flex flex-col">
        <div className="mt-20 text-center font-mackinac text-3xl font-bold">
          What do you want to check?
        </div>
        <CreateOwnChecker />
        <LoveChecklet
          className="absolute bottom-[15rem] right-[0%] h-[6rem] md:right-[1%]"
          height={200}
          width={200}
        />
        <PennyChecklet
          className="absolute right-[7%] top-[10rem] h-[7rem] sm:right-[10%] md:right-[15%]"
          height={200}
          width={200}
        />
        <SpacyChecklet
          className="absolute left-[5%] top-32 h-[8rem]"
          height={200}
          width={200}
        />
        <CheckerStore />
      </div>
    </>
  );
};

export default Page;
