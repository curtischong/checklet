import { LabelWithSwitch } from "@/app/_components/ui/Switch";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import { type SetState } from "@/utils/types";
import React, { useCallback } from "react";
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
  const { trpcClient } = useTrpcCtx();

  const onSwitchToggle = useCallback((newIsPublic: boolean) => {
    setIsPublic(newIsPublic); // optimistically update the UI
    handleErr(
      trpcClient.checker.updateIsPublic.mutate({
        id: checkerId,
        isPublic: newIsPublic,
      }),
      (data) => {
        if (data.isPublic) {
          toast.success("Your checker is now public!");
        } else {
          toast.success("Your checker is now private");
        }
        setIsPublic(data.isPublic);
      },
      () => {
        setIsPublic(!newIsPublic);
      },
    );
  }, []);

  return (
    <LabelWithSwitch
      text="Is Public:"
      helpText="Share your Checker with friends by making it public!"
      isChecked={isPublic}
      setChecked={onSwitchToggle}
    />
  );
};
