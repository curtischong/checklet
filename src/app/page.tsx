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
import { DownArrowWithTailIcon2 } from "@/app/_components/icons/DownArrowWithTailIcon";
import { LinkButton } from "@/app/_components/ui/Button";
import { StoreFront } from "@/app/checkers/CheckerStore";
import {
  DemoSuggestionCard,
  DemoSuggestionCard2,
} from "@/app/landing/DemoSuggestionCard";
import { trackPageView } from "@/mixpanel";
import { createShortId } from "@/utils/strings";
import { AccessType } from "@prisma/client";

const HomePage: React.FC = () => {
  trackPageView();
  return (
    <div>
      <div className="container mx-auto px-6 text-center">
        <div className="ml-0 flex h-[100vh] flex-col justify-center">
          <SpacyChecklet className="absolute left-[5%] top-[12%] md:left-[20%] md:top-[20%]" />
          <LoveChecklet className="absolute bottom-[5%] right-[2%] md:bottom-[25%] md:right-[20%]" />
          <DockyChecklet className="absolute bottom-[10%] left-[2%] md:left-[30%]" />
          <DerpChecklet className="absolute right-[5%] top-[8%] md:right-[30%] md:top-[7%]" />
          <p className="font-mackinac text-5xl">Checklet</p>
          <div className="mx-auto max-w-screen-md">
            <p className="text-md z-10 mt-4">
              Checklet is your own customizable Grammarly.
            </p>
            <p className="text-md z-10 mx-auto mt-8">
              Receive suggestions tailored to your writing style - unlike
              traditional Grammar checkers which provide generic grammar fixes.
            </p>

            <p className="text-md z-10 mt-4">
              Use it to polish jokes, edit resumes, revise emails... and check
              anything!
            </p>
          </div>
          <div className="mx-auto mt-8 w-[200px]">
            <LinkButton url={"/checkers"}>Try it out</LinkButton>
          </div>
          <ScrollDownButton />
        </div>
        {/* <div className="mt-32 font-mackinac text-3xl">What is Checklet?</div>
        <ThinLine />
        <div className="text-md mx-auto mt-10 md:max-w-[70%]">
          Checklet is your own customizable Grammarly. It is different from
          typical Grammar checkers because it gives suggestions tailored to your
          writing style - not generic grammar fixes.
        </div> */}
        {/* <br />
        <div>
          {`But I always wanted to have a Grammarly that's tailored for my
          specific writing (for my newsletter). But Grammarly's suggestions were too generic. Checklet deeply integrates with ChatGPT to give you suggestions relevant to your specific writing.`}
        </div> */}
        <div className="mt-20 font-mackinac text-3xl">
          How to Create Your Own Checker
        </div>
        <ThinLine />
        <div className="mx-auto flex flex-col justify-center text-left md:max-w-[70%]">
          <div className="relative mt-10 flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex-1 text-lg">
              1. Name your checker and describe what it does
            </div>
            <div className="flex-1">
              <StoreFront
                checker={{
                  id: createShortId(),
                  name: "Resume improver",
                  desc: "Dazzle recruiters with a stronger resume!",
                  prompt: "fake prompt",
                  sampleDoc: "fake doc",
                  accessType: AccessType.PUBLIC,
                  isValid: true,
                  clonedFromId: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  createdById: "fakeid",
                }}
                isDemo={true}
              />
              {/* <CursorIcon className="absolute bottom-[-20px] right-32 h-[40px] w-[40px]" /> */}
            </div>
            <MushyChecklet className="absolute right-0 top-[20px] md:left-[10%] md:top-[3.5rem]" />
          </div>

          <div className="relative mt-24 flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex-1 text-lg">
              2. Write a prompt that tells the AI how to improve the document
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="font-mackinac text-3xl">Prompt</div>
                <hr className="h-[2px] w-full bg-black" />
                <div className="mt-4 rounded-md bg-white p-4">
                  <div className="">
                    • Shorten months to its 3-letter abbreviation
                  </div>
                  <div className="">• Use contractions (more white space)</div>
                  <div className="">{`• Change "many" to specific quantities`}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-2 h-32 justify-center">
            <PennyChecklet className="absolute right-[30%] top-[0px] md:top-[1rem]" />
          </div>
          <div className="mt-12 flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex-1 text-lg">
              3. Paste your writing into the editor and see instant feedback
            </div>

            <div className="flex-1">
              <div className="max-w-[350px]">
                <DemoSuggestionCard />
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-col justify-center gap-8 md:flex-row">
            <div className="flex-1 text-lg">
              4. {`Iterate with better prompts until you love the suggestions!`}
            </div>

            <div className="flex-1">
              <div className="relative">
                <div className="font-mackinac text-3xl">Prompt</div>
                <hr className="h-[2px] w-full bg-black" />
                <div className="mt-4 rounded-md bg-white p-4">
                  <div className="">
                    • Shorten months to its 3-letter abbreviation.{" "}
                    <span className="font-bold">Do NOT add a period.</span>
                  </div>
                </div>
              </div>
              <DownArrowWithTailIcon2 className="mx-auto my-6 w-32 text-slate-600" />
              <div className="max-w-[350px]">
                <DemoSuggestionCard2 />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 mt-12 text-2xl">
          Checklet makes editing more fun than ever.
        </div>
        <LinkButton className="mb-12" url={"/checkers"}>
          Try it out
        </LinkButton>
      </div>
    </div>
  );
};

export default HomePage;
