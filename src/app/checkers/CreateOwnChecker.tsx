import Link from "next/link";

export const CreateOwnChecker = () => {
  return (
    <div className="mx-auto mt-2">
      Can&lsquo;t find a checker you like?{" "}
      <Link
        href="/dashboard?redirect-reason=create-checker"
        className="mx-auto mt-4 cursor-pointer border-b-2 border-blue-500 hover:text-blue-600"
      >
        Create your own Checker
      </Link>
    </div>
  );
};
