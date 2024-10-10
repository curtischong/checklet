import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  desc: string;
  isHeightCapped: boolean;
}
export const CheckerDesc = ({ desc, isHeightCapped }: Props) => {
  const DescElement = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // we need the markdown class to help us with tailwind css issues: https://stackoverflow.com/questions/74607419/react-markdown-don%C2%B4t-render-markdown
      className="markdown space-y-[0px]"
      components={{
        a: ({ ...props }) => (
          <a
            target="_blank"
            className="cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
            {...props}
          />
        ),
      }}
    >
      {desc}
    </ReactMarkdown>
  );
  if (!isHeightCapped) {
    return DescElement;
  }
  return (
    <div className="relative max-h-32 overflow-hidden">
      {DescElement}
      <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};
