interface Props {
  checklet: JSX.Element;
  header: string;
  content: JSX.Element;
}

export const NoSuggestionMessage = ({ checklet, header, content }: Props) => {
  return (
    <div className="m-auto flex flex-col items-center pt-8 text-center">
      {checklet}
      <div className="py-2 font-bold">{header}</div>
      <div className="flex flex-col items-center justify-center">{content}</div>
    </div>
  );
};
