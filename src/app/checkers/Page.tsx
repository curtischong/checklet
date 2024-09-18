import { CheckerStore } from "@/app/checkers/CheckerStore";
import { CreateOwnChecker } from "@/app/checkers/CreateOwnChecker";
import { db } from "@/server/db";
import { getUserCtx } from "@/server/firebase/user_ctx";
import LoveChecklet from "@public/checklets/love.svg";
import PennyChecklet from "@public/checklets/penny.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import Image from "next/image";

const Page = async () => {
  const checkers = await db.checker.findMany({
    where: {
      isPublic: {
        equals: true,
      },
      isValid: {
        equals: true,
      },
    },
  });
  const user = await getUserCtx();
  console.log("user");
  console.log(user);

  return (
    <div className="mx-auto container flex flex-col">
      <div className="text-center text-3xl mt-20 font-bold font-mackinac">
        What do you want to check?
      </div>
      <CreateOwnChecker user={user} />
      <Image
        alt="LoveChecklet"
        src={LoveChecklet.src}
        width={200}
        height={200}
        className="h-[6rem] bottom-[15rem] right-[0%] md:right-[1%] absolute"
      />
      <Image
        alt="PennyChecklet"
        src={PennyChecklet.src}
        width={200}
        height={200}
        className="h-[7rem] top-[10rem] right-[7%] sm:right-[10%] md:right-[15%] absolute"
      />
      <Image
        alt="SpacyChecklet"
        src={SpacyChecklet.src}
        width={200}
        height={200}
        className="h-[8rem] top-32 left-[5%] absolute"
      />
      <CheckerStore checkers={checkers} />
    </div>
  );
};

export default Page;
