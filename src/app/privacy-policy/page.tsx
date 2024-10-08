import { trackPageView } from "@/mixpanel";

const PrivacyPolicy: React.FC = () => {
  trackPageView();
  return (
    <div className="flex flex-col">
      <div className="container mx-auto mt-20 grow" style={{ flexBasis: 0 }}>
        <div className="flex flex-col justify-center">
          <div className="mx-auto max-w-[700px] p-6">
            <h1 className="text-center font-mackinac text-3xl font-bold">
              Privacy Policy
            </h1>
            <ul className="mt-8 list-disc space-y-8 pl-4">
              <li>
                {`We won't collect your private data and sell it to anybody`}
              </li>
              <li>
                We will not store your documents. When you check your document,
                we only send it to our servers before sending it to OpenAI then
                back to you.
              </li>
              <li>
                We will be able to see your checkers. (So we can moderate them).
              </li>
              {/* <li>
                If you make a checker, other people can see your checker's
                prompts
              </li> */}
              {/* This isn't a privacy policy? Not sure where to put this*/}
              <li>
                You are the owner of the checkers you made. You typed them
                afterall!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
