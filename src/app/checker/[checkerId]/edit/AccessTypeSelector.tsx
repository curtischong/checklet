import { DropdownWithoutState } from "@/app/_components/ui/Dropdown";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { handleErr } from "@/trpc/react";
import { type SetState } from "@/utils/types";
import { AccessType } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  checkerId: string;
}

interface AccessTypeSelectorProps extends Props {
  initialAccessType: AccessType;
}

export const AccessTypeSelector = ({
  initialAccessType,
  checkerId,
}: AccessTypeSelectorProps) => {
  const [accessType, setAccessType] = useState<AccessType>(initialAccessType);
  return (
    <AccessTypeSelectorWithoutState
      checkerId={checkerId}
      accessType={accessType}
      setAccessType={setAccessType}
    />
  );
};

interface IsPublicSwitchWithoutStateProps extends Props {
  accessType: AccessType;
  setAccessType: SetState<AccessType>;
}

const textToAccessType = {
  Private: AccessType.PRIVATE,
  Hidden: AccessType.HIDDEN,
  Public: AccessType.PUBLIC,
};
type AccessTypeText = keyof typeof textToAccessType;

const accessTypeToText: Record<AccessType, AccessTypeText> = {
  [AccessType.PRIVATE]: "Private",
  [AccessType.HIDDEN]: "Hidden",
  [AccessType.PUBLIC]: "Public",
};

// use this when you need access to setIsPublic or isPublic above this component
export const AccessTypeSelectorWithoutState = ({
  checkerId,
  accessType,
  setAccessType,
}: IsPublicSwitchWithoutStateProps): JSX.Element => {
  const { trpcClient } = useTrpcCtx();

  const onChange = useCallback(
    (newAccessType: AccessType) => {
      const oldAccessType = accessType;
      setAccessType(newAccessType); // optimistically update the UI
      handleErr(
        trpcClient.checker.updateAccessType.mutate({
          id: checkerId,
          accessType: newAccessType,
        }),
        (data) => {
          toast.success(
            `Your checker is now ${accessTypeToText[data.accessType]}!`,
          );
          setAccessType(data.accessType);
        },
        () => {
          setAccessType(oldAccessType);
        },
      );
    },
    [accessType],
  );

  return (
    <DropdownWithoutState<AccessTypeText>
      label="Access Type:"
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      options={[AccessType.PRIVATE, AccessType.HIDDEN, AccessType.PUBLIC].map(
        (x) => accessTypeToText[x],
      )}
      setSelected={(newAccessType: AccessTypeText) =>
        onChange(textToAccessType[newAccessType])
      }
      selected={accessTypeToText[accessType]}
      className="w-[5.7rem]"
      helpText={`Public Checkers: Accessible to anyone
Hidden Checkers: Accessible to ppl that have the URL
Private Checkers: Only accessible to you`}
    />
  );
};
