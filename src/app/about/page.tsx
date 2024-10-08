import { trackPageView } from "@/mixpanel";
import Image from "next/image";
import Link from "next/link";

const About: React.FC = () => {
  trackPageView();
  return (
    <div className="flex flex-col">
      <div className="container mx-auto mt-20 grow" style={{ flexBasis: 0 }}>
        <div className="flex flex-col justify-center">
          <div className="mx-auto max-w-[700px] p-6">
            <h1 className="text-center font-mackinac text-3xl font-bold">
              About
            </h1>
            <Image
              alt="A photo of me!"
              src="/about/curtis-chong.webp"
              width={200}
              height={500}
              className="mx-auto mt-10"
            />
            <p>{`Hello! It's Curtis.`}</p>
            <p className="mt-4">
              This project has been my dream for years. In 2020, when I started{" "}
              <Link
                href="https://curtischong.me/sleepovers"
                className="mx-auto mt-4 cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
                target="_blank"
              >
                my newsletter,
              </Link>{" "}
              I spent 60x longer editing than creating the initial draft.
            </p>
            <p className="mt-4">Grammarly helped me edit all my newsletters.</p>
            <p className="mt-4">
              {`But it wasn't enough! I still spent hours fiddling with wording-
              trying to make it fun and quick to read. It would have been better
              if there were tailored Grammarly suggestions for my writing style.
              So, I put together the first version of Checklet:`}
            </p>
            <Image
              alt="The first version of Checklet"
              src="/about/checkletv1.webp"
              width={700}
              height={500}
              className="mx-auto mt-6"
            />
            <p className="mt-6">
              Cool demo? Yes. Useful? Not quite. So, I put the idea on the back
              burner for a few years, improving it gradually. My project did
              bore some fruit though. After showing my demo to Grammarly, I was
              fortunate to land an internship there!
            </p>
            <p className="mt-4">
              {`At the company, I presented a few grammar-checking cards to their
              team (e.g., suggesting idioms to spice up one's writing). Still,
              the suggestions were too specific for their generic grammar
              editor. I even pitched Checklet to my manager in 2023 but have yet
              to hear a response!`}
            </p>
            <p className="mt-4">
              {`Since I really wanted tailored writing suggestions and nobody
              built this, I put together this app. Checklet is version 5 of this
              idea, but it's still incredibly flawed. So, if you have
              suggestions on how to improve it, let me know!`}
            </p>
            <p className="mt-4">Hope to see you around!</p>
            <p>- Curtis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
