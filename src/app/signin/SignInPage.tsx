"use client";
import { Footer } from "@/app/_components/Footer";
import ProviderList from "@/app/signin/ProviderList";
import DockyChecklet from "@public/checklets/docky.svg";
import LoveChecklet from "@public/checklets/love.svg";
import SpacyChecklet from "@public/checklets/spacy.svg";
import { getProviders } from "next-auth/react";
import Image from "next/image";

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
}
export default function SignInPage({ providers }: Props) {
  if (!providers) {
    return <div>No providers available</div>;
  }

  return (
    <div className=" flex flex-col h-screen">
      <div
        className="container mx-auto mt-20 grow flex flex-col justify-center"
        style={{ flexBasis: 0 }}
      >
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-center font-mackinac">
            Checklet
          </h1>
        </div>
        <Image
          alt="LoveChecklet"
          src={LoveChecklet.src}
          width={200}
          height={200}
          className="h-[6rem] bottom-[15rem] right-[5%] md:right-[20%] absolute"
        />
        <Image
          alt="SpacyChecklet"
          src={SpacyChecklet.src}
          width={200}
          height={200}
          className="h-[8rem] top-32 left-[20%] absolute"
        />
        <Image
          alt="DockyChecklet"
          src={DockyChecklet.src}
          width={200}
          height={200}
          className="h-[6rem] bottom-[10rem] left-[5%] md:left-[30%] absolute"
        />
        {/* <TextButton
        className="mx-auto mb-4"
        onClick={() => {
            router.push("/editor");
        }}
    >
        Go to Editor
    </TextButton> */}
        <div className="text-center mb-4">
          Want to create a checker? Sign in/sign up below!
        </div>
        <ProviderList providers={providers} />
      </div>
      <Footer isAbsolute={false} />
    </div>
  );
}
