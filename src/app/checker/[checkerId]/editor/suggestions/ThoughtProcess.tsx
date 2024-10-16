import ThinLine from "@/app/_components/ThinLine";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  checkerThoughts: string | null;
}

export const ThoughtProcess = ({ checkerThoughts }: Props) => {
  const markdownContainerRef = useRef<HTMLDivElement | null>(null);
  const userManuallyScrolledRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Use window events to detect manual scrolling
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const container = markdownContainerRef.current;
      if (!container) return;

      // Check if the event target is inside the container
      if (container.contains(event.target as Node)) {
        // User is scrolling inside the container
        userManuallyScrolledRef.current = true;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Observe whether the bottom of the content is visible
  useEffect(() => {
    const container = markdownContainerRef.current;
    const bottomElement = bottomRef.current;

    if (!container || !bottomElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Bottom of content is visible
            userManuallyScrolledRef.current = false;
          }
        });
      },
      {
        root: container,
        threshold: 1.0,
      },
    );

    observer.observe(bottomElement);

    return () => {
      observer.disconnect();
    };
  }, [checkerThoughts]);

  // Auto-scroll when new content is added if the user is not manually scrolled up
  useEffect(() => {
    if (!checkerThoughts) return;
    const container = markdownContainerRef.current;
    if (!container) return;

    // If user has not manually scrolled up, auto-scroll
    if (!userManuallyScrolledRef.current) {
      // Scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
    // Else do not auto-scroll
  }, [checkerThoughts]);

  return (
    <div
      ref={markdownContainerRef}
      style={{
        maxHeight: "calc(100vh - 50px - 40px - 10px - 30px - 5px)",
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
      // className="relative z-10"
    >
      {checkerThoughts === null ? (
        <div>This will populate when you check your document!</div>
      ) : (
        <>
          <div className="mx-4">
            <p className="text-sm font-bold">Pro tips:</p>
            <ul className="ml-4 list-disc">
              <li className="text-sm text-zinc-600">
                Smaller documents get checked faster
              </li>
              <li className="text-sm text-zinc-600">{`Keep clicking "Check Document" for new suggestions`}</li>
            </ul>
          </div>
          <ThinLine />
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="markdown space-y-0 px-4 pb-10"
            // components={{
            //   a: ({ ...props }) => (
            //     <a
            //       target="_blank"
            //       rel="noopener noreferrer"
            //       className="cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
            //       {...props}
            //     />
            //   ),
            // }}
          >
            {checkerThoughts}
          </ReactMarkdown>
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};
