import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  checkerThoughts: string | null;
}
export const ThoughtProcess = ({ checkerThoughts }: Props) => {
  if (checkerThoughts === null) {
    return <div>This will populate when you check your document!</div>;
  }
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 50px - 40px - 5px - 5px - 40px - 5px - 85px)",
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // we need the markdown class to help us with tailwind css issues: https://stackoverflow.com/questions/74607419/react-markdown-don%C2%B4t-render-markdown
        className="markdown space-y-[0px] px-6 pb-10"
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
        {checkerThoughts}
      </ReactMarkdown>
    </div>
  );
};
