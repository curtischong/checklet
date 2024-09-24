import classNames from "classnames";
import Image from "next/image";

interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export const SpacyChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="SpacyChecklet"
      src="/checklets/spacy.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const LoveChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="LoveChecklet"
      src="/checklets/love.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const DockyChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="DockyChecklet"
      src="/checklets/docky.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const DerpChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="DerpChecklet"
      src="/checklets/derp.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const MushyChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="MushyChecklet"
      src="/checklets/mushy.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const PennyChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="PennyChecklet"
      src="/checklets/penny.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const YayChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="YayChecklet"
      src="/checklets/yay.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const CoolChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="CoolChecklet"
      src="/checklets/cool.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};

export const PencilChecklet = ({
  className = "",
  width = 100,
  height = 100,
}: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="PencilChecklet"
      src="/checklets/pencil.svg"
      width={width}
      height={height}
      className={combinedClassName}
    />
  );
};
