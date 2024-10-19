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
  defaultAccessType: AccessType;
}

export const AccessTypeSelector = ({
  defaultAccessType,
  checkerId,
}: AccessTypeSelectorProps) => {
  const [accessType, setAccessType] = useState<AccessType>(defaultAccessType);
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
          if (data.accessType) {
            toast.success("Your checker is now public!");
          } else {
            toast.success("Your checker is now private");
          }
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
    <DropdownWithoutState<AccessType>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      options={[AccessType.PRIVATE, AccessType.HIDDEN, AccessType.PUBLIC]}
      onChange={onChange}
      setSelected={setAccessType}
      selected={accessType}
    />
  );
};
