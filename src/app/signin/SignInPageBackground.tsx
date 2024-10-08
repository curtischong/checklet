"use client";
import {
  DockyChecklet,
  LoveChecklet,
  SpacyChecklet,
} from "@/app/_components/checklets/checklets";

interface Props {
  children: React.ReactNode;
}

export const SignInPageBackground = ({ children }: Props) => {
  return (
    <div className="flex flex-col">
      <div
        className="container mx-auto mt-20 flex grow flex-col justify-center"
        style={{ flexBasis: 0 }}
      >
        <div className="mb-4">
          <h1 className="text-center font-mackinac text-4xl font-bold">
            Checklet
          </h1>
        </div>
        <LoveChecklet className="absolute bottom-[5%] right-[2%] h-[10rem] md:bottom-[25%] md:right-[20%]" />
        <SpacyChecklet className="absolute left-[23%] top-32 h-[8rem]" />
        <DockyChecklet className="absolute bottom-[10rem] left-[5%] z-0 h-[6rem] md:left-[20%]" />
        <div className="z-10">{children}</div>
      </div>
    </div>
  );
};
