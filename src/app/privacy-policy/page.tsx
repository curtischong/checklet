import { Footer } from "@/app/_components/Footer";
import { trackPageView } from "@/mixpanel";

const PrivacyPolicy: React.FC = () => {
  trackPageView();
  return (
    <div className="flex h-screen flex-col">
      <div className="container mx-auto mt-20 grow" style={{ flexBasis: 0 }}>
        <div className="flex flex-col justify-center">
          <div className="mx-auto max-w-[700px] p-6">
            <h1 className="text-center font-mackinac text-3xl font-bold">
              Privacy Policy
            </h1>
            <ul className="mt-8 list-disc space-y-8 pl-4">
              <li>
                We won&apos;t collect your private data and sell it to anybody
              </li>
              <li>
                We will not store your documents. When you check your document,
                we only send it to our servers before sending it to OpenAI then
                back to you. If you want complete privacy, you can pass in your
                own API key (so the API calls to OpenAI are made from your
                computer).
              </li>
              <li>
                We will be able to see your checkers/checks. (So we can moderate
                them).
              </li>
              <li>
                If you pass in your private API key, the key is stored in your
                browser&apos;s local storage. So don&apos;t worry about that!
              </li>
              <li>
                If you make a checker, other people can see the checks / prompts
                (because they need the prompts to run the check locally on their
                computer using their API key)
              </li>
              {/* This isn't a privacy policy? Not sure where to put this*/}
              <li>
                You are the owner of the checkers/checks you made. You typed
                them afterall!
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer isAbsolute={false} />
    </div>
  );
};

export default PrivacyPolicy;
