import { trackPageView } from "@/mixpanel";

export default function NotFound() {
  trackPageView();

  // the 85px is the height + margin top of the footer
  return (
    <>
      <div className="flex h-[calc(100vh-85px)] items-center justify-center">
        <h1 className="font-mackinac text-2xl">
          Error 404: Page not found ¯\_(ツ)_/¯
        </h1>
      </div>
    </>
  );
}
