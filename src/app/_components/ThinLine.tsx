import classNames from "classnames";

interface Props {
  className?: string;
  color?: string;
}
export default function ThinLine({ className }: Props): JSX.Element {
  const classes = classNames(
    `border-0 bg-gradient-to-r from-transparent via-zinc-400 to-transparent mx-auto my-2 w-3/4`,
    className,
  );

  const line = (
    <hr
      className={classes}
      style={{
        height: 1,
      }}
    />
  );
  return line;
}
