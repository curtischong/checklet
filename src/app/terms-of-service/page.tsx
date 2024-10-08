import { trackPageView } from "@/mixpanel";

const TermsOfService: React.FC = () => {
  trackPageView();
  return (
    <div className="flex flex-col">
      <div className="container mx-auto mt-20 grow" style={{ flexBasis: 0 }}>
        <div className="flex flex-col justify-center">
          <div className="mx-auto p-6">
            <h1 className="break-words text-center font-mackinac text-3xl font-bold">
              Terms of Service
            </h1>
            <ul className="mt-8 list-disc space-y-8 pl-4">
              <li>{`Please don't spam the servers.`}</li>
              <li>
                {`Please don't make checkers that are designed to waste API
                calls. Be friendly!`}
              </li>
              <li>
                Please keep your checkers PG-13. They are public afterall!
              </li>
              <li>{`Please don't harass other users.`}</li>
            </ul>
            <p className="mt-8">
              {`If you break these terms of service I will ban you. Just please
              don't be a jerk`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
