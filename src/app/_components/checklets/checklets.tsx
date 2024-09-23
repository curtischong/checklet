import classNames from "classnames";
import Image from "next/image";

interface Props {
  className?: string;
}

export const SpacyChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="SpacyChecklet"
      src="/checklets/spacy.svg"
      width={100}
      height={100}
      className={combinedClassName}
    />
  );
};

export const LoveChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="LoveChecklet"
      src="/checklets/love.svg"
      width={100}
      height={200}
      className={combinedClassName}
    />
  );
};

export const DockyChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="DockyChecklet"
      src="/checklets/docky.svg"
      width={100}
      height={200}
      className={combinedClassName}
    />
  );
};

export const DerpChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="DerpChecklet"
      src="/checklets/derp.svg"
      width={100}
      height={200}
      className={combinedClassName}
    />
  );
};

export const MushyChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="MushyChecklet"
      src="/checklets/mushy.svg"
      width={100}
      height={200}
      className={combinedClassName}
    />
  );
};

export const PennyChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="PennyChecklet"
      src="/checklets/penny.svg"
      width={100}
      height={100}
      className={combinedClassName}
    />
  );
};

export const YayChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="YayChecklet"
      src="/checklets/yay.svg"
      width={100}
      height={100}
      className={combinedClassName}
    />
  );
};

export const CoolChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="CoolChecklet"
      src="/checklets/cool.svg"
      width={100}
      height={100}
      className={combinedClassName}
    />
  );
};

export const PencilChecklet = ({ className = "" }: Props) => {
  const combinedClassName = classNames("", className);
  return (
    <Image
      alt="PencilChecklet"
      src="/checklets/pencil.svg"
      width={100}
      height={100}
      className={combinedClassName}
    />
  );
};
