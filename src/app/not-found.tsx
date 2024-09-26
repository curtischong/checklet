import { Footer } from "@/app/_components/Footer";

export default function NotFound() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <h1 className="font-mackinac text-2xl">
          Error 404: Page not found ¯\_(ツ)_/¯
        </h1>
      </div>
      <Footer isAbsolute={true} />
    </>
  );
}
