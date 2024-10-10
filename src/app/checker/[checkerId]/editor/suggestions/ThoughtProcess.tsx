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
        maxHeight: "calc(100vh - 50px)",
      }}
    >
      {checkerThoughts}
    </div>
  );
};
