// https://icon-sets.iconify.design/heroicons-solid/stop/

interface Props {
  className?: string;
}

export const StopIcon = ({ className }: Props): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      className={className}
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M10 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16M8 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"
        clip-rule="evenodd"
      />
    </svg>
  );
};
