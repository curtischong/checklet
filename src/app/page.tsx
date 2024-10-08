// import { StoreFront } from "@/app/_components/CheckerStore";
import ThinLine from "@/app/_components/ThinLine";
import {
  DerpChecklet,
  DockyChecklet,
  LoveChecklet,
  MushyChecklet,
  PennyChecklet,
  SpacyChecklet,
} from "@/app/_components/checklets/checklets";
import { ScrollDownButton } from "@/app/landing/ScrollDownButton";
// import { CheckPreview } from "@/app/_components/create-check/CheckPreview";
// import { rizzumeDesc } from "@/app/_components/create-check/DefaultTextForCheckType";
// import { CheckType } from "@/app/_components/create-checker/CheckerTypes";
import { CursorIcon } from "@/app/_components/icons/CursorIcon";
import { LinkButton } from "@/app/_components/ui/Button";
import { StoreFront } from "@/app/checkers/CheckerStore";
import { DemoSuggestionCard } from "@/app/landing/DemoSuggestionCard";
import { trackPageView } from "@/mixpanel";
import { createShortId } from "@/utils/strings";

const HomePage: React.FC = () => {
  trackPageView();
  return (
    <div>
      <div className="container mx-auto px-6 text-center">
        <div className="ml-0 flex h-[100vh] flex-col justify-center">
          <SpacyChecklet className="absolute left-[5%] top-[10%] md:left-[20%] md:top-[20%]" />
          <LoveChecklet className="absolute bottom-[5%] right-[2%] md:bottom-[25%] md:right-[20%]" />
          <DockyChecklet className="absolute bottom-[10%] left-[2%] md:left-[30%]" />
          <DerpChecklet className="absolute right-[5%] top-[5%] md:right-[30%]" />
          <p className="font-mackinac text-5xl">Checklet</p>
          <p className="z-10 mt-4">
            Expert-written checkers to polish jokes, edit resumes, revise
            emails... and check anything!
          </p>
          <div className="mx-auto mt-4 w-[200px]">
            <LinkButton url={"/checkers"}>Try it out</LinkButton>
          </div>
          <ScrollDownButton />
        </div>
        <div className="mt-32 font-mackinac text-3xl">What is Checklet?</div>
        <ThinLine />
        <div className="mx-auto mt-10 md:max-w-[70%]">
          Checklet is your own customizable Grammarly. It is different from
          typical Grammar checkers because it gives suggestions tailored to your
          writing style - not generic grammar fixes.
        </div>
        {/* <br />
        <div>
          {`But I always wanted to have a Grammarly that's tailored for my
          specific writing (for my newsletter). But Grammarly's suggestions were too generic. Checklet deeply integrates with ChatGPT to give you suggestions relevant to your specific writing.`}
        </div> */}
        <div className="mt-20 font-mackinac text-3xl">How it works</div>
        <ThinLine />
        <div className="mx-auto flex flex-col justify-center text-left md:max-w-[70%]">
          <div className="relative mt-10 flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex-1 text-lg">
              1. Select a Checker for your type of writing
            </div>
            <div className="flex-1">
              <StoreFront
                checker={{
                  id: createShortId(),
                  name: "Rizzume",
                  desc: "Dazzle recruiters with a stronger resume!",
                  prompt: "fake prompt",
                  sampleDoc: "fake doc",
                  isPublic: true,
                  isValid: true,
                  clonedFromId: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  createdById: "fakeid",
                }}
                isDemo={true}
              />
              <CursorIcon className="absolute bottom-[-20px] right-32 h-[40px] w-[40px]" />
            </div>
            <MushyChecklet className="absolute right-0 top-[20px] md:left-[10%] md:top-[3.5rem]" />
          </div>

          <div className="relative mt-16 flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex-1 text-lg">
              2. Paste your writing into the editor
            </div>
            <div className="flex-1">
              <div className="relative max-w-[300px]">
                <div className="font-mackinac text-3xl text-gray-400">
                  Rizzume
                </div>
                <div className="text-md text-gray-400">
                  Rizz up your resume to dazzle...
                </div>
                <hr className="h-[2px] w-full bg-black" />
                <div>Grammarly • January 2021 - Present</div>
                <div>
                  • Expedited DynamoDB queries from 68 ms to 41 ms by optimizing
                  the schema for reads
                </div>
                <div>...</div>
              </div>
            </div>
          </div>
          <div className="relative h-32 justify-center">
            <PennyChecklet className="absolute right-[30%] top-[0px] md:top-[1rem]" />
          </div>
          <div className="flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex-1 text-lg">3. Receive instant feedback</div>

            <div className="flex-1">
              <div className="max-w-[350px]">
                <DemoSuggestionCard />
              </div>
            </div>
          </div>
        </div>
        <LinkButton url={"/checkers"}>Try it out</LinkButton>
      </div>
    </div>
  );
};

export default HomePage;
