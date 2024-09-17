interface Props {
  name: string;
  desc: string;
  prompt: string;
}

export const IsValidWarning = ({ name, desc, prompt }: Props) => {
  if (name === "") {
    return "Please enter a name";
  } else if (desc === "") {
    return "Please enter a description";
  } else if (prompt === "") {
    return "Please enter a prompt";
  } else {
    return "";
  }
};
