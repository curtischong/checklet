import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  checkerThoughts: string | null;
}

export const ThoughtProcess = ({ checkerThoughts }: Props) => {
  const markdownContainerRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrollingRef = useRef(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  // Threshold in pixels to determine if near the bottom
  const threshold = 50;

  // Function to handle user scrolling
  const handleScroll = () => {
    const container = markdownContainerRef.current;
    if (!container) return;

    if (isAutoScrollingRef.current) {
      // Ignore scroll events caused by auto-scrolling
      isAutoScrollingRef.current = false;
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const atBottom = scrollHeight - (scrollTop + clientHeight) < threshold;
    setIsUserScrolledUp(!atBottom);
  };

  // Auto-scroll when new content is added unless the user scrolled up
  useEffect(() => {
    const container = markdownContainerRef.current;
    if (!container || checkerThoughts === null) return;

    if (!isUserScrolledUp) {
      isAutoScrollingRef.current = true;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [checkerThoughts]);

  return (
    <div
      ref={markdownContainerRef}
      onScroll={handleScroll}
      style={{
        maxHeight: "calc(100vh - 50px - 40px - 5px - 5px - 40px - 5px - 85px)",
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
    >
      {checkerThoughts === null ? (
        <div>This will populate when you check your document!</div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="markdown space-y-[0px] px-6 pb-10"
          components={{
            a: ({ ...props }) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
                {...props}
              />
            ),
          }}
        >
          {checkerThoughts}
        </ReactMarkdown>
      )}
    </div>
  );
};
