interface Props {
    imageSrc: string;
    header: string;
    content: JSX.Element;
}

export const NoSuggestionMessage = ({ imageSrc, header, content }: Props) => {
    return (
        <div className="flex flex-col items-center text-center m-auto pt-8">
            <img src={imageSrc} className="h-[18.75rem]" />
            <div className="font-bold py-2">{header}</div>
            <div className="flex flex-col items-center justify-center">
                {content}
            </div>
        </div>
    );
};
