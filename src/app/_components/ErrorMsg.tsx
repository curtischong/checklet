export const ErrorMsg = ({ message }: { message: string }) => {
  return (
    <div className="mx-auto mt-10 text-center">
      <p>{message}</p>
    </div>
  );
};
