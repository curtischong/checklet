"use client";
import { Footer } from "@/app/_components/Footer";
import DockyChecklet from "@public/checklets/docky.svg";
import LoveChecklet from "@public/checklets/love.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

export const SignInPageBackground = ({ children }: Props) => {
  return (
    <div className="flex h-screen flex-col">
      <div
        className="container mx-auto mt-20 flex grow flex-col justify-center"
        style={{ flexBasis: 0 }}
      >
        <div className="mb-4">
          <h1 className="text-center font-mackinac text-4xl font-bold">
            Checklet
          </h1>
        </div>
        <Image
          alt="LoveChecklet"
          src={LoveChecklet as string}
          width={200}
          height={200}
          className="absolute bottom-[15rem] right-[5%] h-[6rem] md:right-[20%]"
        />
        <Image
          alt="SpacyChecklet"
          src={SpacyChecklet as string}
          width={200}
          height={200}
          className="absolute left-[23%] top-32 h-[8rem]"
        />
        <Image
          alt="DockyChecklet"
          src={DockyChecklet as string}
          width={200}
          height={200}
          className="absolute bottom-[10rem] left-[5%] z-0 h-[6rem] md:left-[20%]"
        />
        <div className="z-10">{children}</div>
      </div>
      <Footer isAbsolute={false} />
    </div>
  );
};
