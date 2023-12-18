// https://stackoverflow.com/questions/60332183/new-line-with-react-markdown
import { FC, ReactNode, memo } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
    className?: string;
    children?: ReactNode;
    markdown: string;
};

const SC = {
    P: styled("p")(({ theme }) => ({
        whiteSpace: "pre-wrap",
    })),
};

const MarkDownView: FC<Props> = memo(function MarkdownView({
    className,
    markdown,
}) {
    return (
        <ReactMarkdown
            className={className}
            remarkPlugins={[remarkGfm]}
            components={{
                p({ className, children, ...props }) {
                    return <SC.P className={className}>{children}</SC.P>;
                },
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
});

export default MarkDownView;
