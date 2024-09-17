import { Api } from "@api/apis";
import { CheckerId } from "@api/checker";
import { LabelWithSwitch } from "@components/Switch";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  checkerId: CheckerId;
  name: string;
  desc: string;
  prompt: string;
  isPublic: boolean;
}

export const IsPublicSwitch = ({
  checkerId,
  name,
  desc,
  prompt,
  isPublic,
}: Props): JSX.Element => {
  const [clickedIsPublic, setClickedIsPublic] = useState(false);
  const [tmpChecked, setTmpChecked] = useState<boolean>(isPublic);
  const [err, setErr] = useState("");
  const { user } = useClientContext();

  useEffect(() => {
    setTmpChecked(isPublic);
  }, [isPublic]);

  // TODO: use the same function as in the backend
  const getIncompleteFormErr = useCallback(() => {
    if (name === "") {
      return "Please enter a name";
    } else if (desc === "") {
      return "Please enter a description";
    } else if (prompt === "") {
      return "Please enter a prompt";
    } else {
      return "";
    }
  }, [name, desc, prompt]);

  useEffect(() => {
    const newErr = getIncompleteFormErr();
    if (newErr !== "") {
      setTmpChecked(false);
    }
    setErr(newErr);
  }, [getIncompleteFormErr]);

  return (
    <div className="flex flex-col">
      {clickedIsPublic && err && (
        <div className="text-[#ff0000] mt-4 ">{err}</div>
      )}
      <LabelWithSwitch
        text="Is Public:"
        helpText="Public checkers are discoverable and usable by anybody. People may reverse-engineer your prompts if you make it public"
        isChecked={tmpChecked}
        setChecked={(newIsChecked: boolean) => {
          setClickedIsPublic(true);
          if (newIsChecked && err !== "") {
            return;
          }

          (async () => {
            if (!user) {
              toast.error(
                "You must be logged in to change a checker's privacy",
              );
              return;
            }
            setTmpChecked(newIsChecked); // if we don't set this initially, the switch wont' change state
            const success = await Api.setCheckerIsPublic(
              checkerId,
              newIsChecked,
              user,
            );
            if (!success) {
              setTmpChecked(!newIsChecked);
            }
          })();
        }}
      />
    </div>
  );
};
