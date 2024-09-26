import { LabelWithSwitch } from "@/app/_components/ui/Switch";
import { api } from "@/trpc/react";
import { type SetState } from "@/utils/types";
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
  return (
    <IsPublicSwitchWithoutState
      checkerId={checkerId}
      isPublic={isPublic}
      setIsPublic={setIsPublic}
    />
  );
};

interface IsPublicSwitchWithoutStateProps {
  checkerId: string;
  isPublic: boolean;
  setIsPublic: SetState<boolean>;
}

// use this when you need access to setIsPublic or isPublic above this component
export const IsPublicSwitchWithoutState = ({
  checkerId,
  isPublic,
  setIsPublic,
}: IsPublicSwitchWithoutStateProps): JSX.Element => {
  const updateIsPublic = api.checker.updateIsPublic.useMutation({
    onMutate: () => {
      setIsPublic(!isPublic); // optimistically update the UI
    },
    onSuccess: (data) => {
      if (data.isPublic) {
        toast.success("Your checker is now public!");
      } else {
        toast.success("Your checker is now private");
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
