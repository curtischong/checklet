import { type CheckerStorefront } from "@/app/checker/[checkerId]/edit/CheckerTypes";

interface Props {
  storefront: CheckerStorefront;
}

export const EditorHeader = ({ storefront }: Props): JSX.Element => {
  return (
    <div>
      <div className="mt-[20px] flex flex-col pt-[20px]">
        <div className="flex flex-row">
          <div className="my-auto flex-grow font-mackinac text-3xl">
            {storefront.name}
          </div>
        </div>
        <div className="text-md">
          <p>{storefront.desc}</p>
        </div>
      </div>
      <hr className="mb-4 mt-1 h-[1px] w-full border-none bg-black" />
    </div>
  );
};
