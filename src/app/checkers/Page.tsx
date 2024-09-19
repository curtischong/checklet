import { CheckerStore } from "@/app/checkers/CheckerStore";
import { CreateOwnChecker } from "@/app/checkers/CreateOwnChecker";
import { db } from "@/server/db";
import LoveChecklet from "@public/checklets/love.svg";
import PennyChecklet from "@public/checklets/penny.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import Image from "next/image";
import { type Prisma } from "@prisma/client";
import { parseAuthHeader } from "@/networking_helpers";

const Page = async () => {
  const targetClauses: Prisma.CheckerWhereInput[] = [
    {
      isPublic: {
        equals: true,
      },
      isValid: {
        equals: true,
      },
    },
  ];
  const user = parseAuthHeader();
  if (user) {
    const yourCheckerClause: Prisma.CheckerWhereInput = {
      createdById: {
        equals: user.id,
      },
    };
    targetClauses.push(yourCheckerClause);
  }

  const checkers = await db.checker.findMany({
    where: { OR: targetClauses },
  });

  return (
    <div className="container mx-auto flex flex-col">
      <div className="mt-20 text-center font-mackinac text-3xl font-bold">
        What do you want to check?
      </div>
      <CreateOwnChecker user={user} />
      <Image
        alt="LoveChecklet"
        src={LoveChecklet as string}
        width={200}
        height={200}
        className="absolute bottom-[15rem] right-[0%] h-[6rem] md:right-[1%]"
      />
      <Image
        alt="PennyChecklet"
        src={PennyChecklet as string}
        width={200}
        height={200}
        className="absolute right-[7%] top-[10rem] h-[7rem] sm:right-[10%] md:right-[15%]"
      />
      <Image
        alt="SpacyChecklet"
        src={SpacyChecklet as string}
        width={200}
        height={200}
        className="absolute left-[5%] top-32 h-[8rem]"
      />
      <CheckerStore checkers={checkers} />
    </div>
  );
};

export default Page;
