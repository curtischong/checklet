import { LabelWithSwitch } from "@/app/_components/ui/Switch";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "react-toastify";

interface Props {
  checkerId: string;
  isInitiallyPublic: boolean;
}

export const IsPublicSwitch = ({
  checkerId,
  isInitiallyPublic,
}: Props): JSX.Element => {
  const [isPublic, setIsPublic] = React.useState(isInitiallyPublic);

  const updateIsPublic = api.checker.updateIsPublic.useMutation({
    onSuccess: (data) => {
      if (data.isPublic) {
        toast.error("Your checker is now public!");
      } else {
        toast.info("Your checker is now private");
      }
      setIsPublic(data.isPublic);
    },
    onError: (data) => {
      const errMsg = "Failed to update isPublic. Error: " + data.message;
      toast.error(errMsg);
      console.warn(errMsg);
    },
  });

  return (
    <LabelWithSwitch
      text="Is Public:"
      helpText="Share your Checker with friends by making it public!"
      isChecked={isPublic}
      setChecked={(newIsPublic: boolean) => {
        updateIsPublic.mutate({ id: checkerId, isPublic: newIsPublic });
      }}
    />
  );
};
