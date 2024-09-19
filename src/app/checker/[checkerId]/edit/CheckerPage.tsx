import { NormalButton } from "@/app/_components/ui/Button";
import { Input } from "@/app/_components/ui/Input";
import { LabelWithHelp } from "@/app/_components/ui/LabelWithHelp";
import { NavigationPath } from "@/app/_components/ui/NavigationPath";
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import {
  SaveStatusText,
  SubmittingState,
} from "@/app/edit/checker/[checkerId]/CheckerTypes";
import { IsPublicSwitch } from "@/app/edit/checker/[checkerId]/IsPublicSwitch";
import { IsValidWarning } from "@/app/edit/checker/[checkerId]/IsValidWarning";
import { Editor } from "@/app/editor/Editor";
import { MAX_CHECKER_DESC_LEN, MAX_CHECKER_NAME_LEN } from "@/constants";
import { api } from "@/trpc/react";
import { Checker } from "@prisma/client";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

export enum Page {
  Main,
  CheckCreator,
}

interface Props {
  originalChecker: Checker;
  userCtx: UserCtx;
}

export const checkerCreatorMarginTop = 50;

export const CheckerPage = ({
  originalChecker,
  userCtx,
}: Props): JSX.Element => {
  const [name, setName] = React.useState(originalChecker.name);
  const [desc, setDesc] = React.useState(originalChecker.desc);
  const [prompt, setPrompt] = React.useState(originalChecker.prompt);
  const [submittingState, setSubmittingState] = React.useState(
    SubmittingState.NotSubmitting,
  );
  const [isPublic, setIsPublic] = React.useState(originalChecker.isPublic);

  const router = useRouter();

  const updateChecker = api.checker.update.useMutation({
    onMutate: () => {
      setSubmittingState(SubmittingState.Submitting);
    },
    onSuccess: () => {
      setSubmittingState(SubmittingState.NotSubmitting);
    },
    onError: () => {
      setSubmittingState(SubmittingState.ChangesDetected);
    },
  });

  const saveChecker = useCallback(
    debounce(
      async (
        newName: string,
        newDesc: string,
        newPrompt: string,
        newIsPublic: boolean,
      ) => {
        // const checkerId =
        //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
        updateChecker.mutate({
          id: originalChecker.id,
          name: newName,
          desc: newDesc,
          prompt: newPrompt,
          isPublic: newIsPublic,
        });
      },
      1000,
    ),
    [],
  );

  useEffect(() => {
    saveChecker(name, desc, prompt, isPublic);
  }, [name, desc, prompt, isPublic]);

  return (
    <div className={`flex justify-center mt-[${checkerCreatorMarginTop}px]`}>
      <div className="container">
        <div className="flex flex-row">
          <div
            className="flex flex-grow flex-col"
            style={{
              flexBasis: "0",
            }}
          >
            <NavigationPath
              sections={[
                {
                  name: "Dashboard",
                  url: "/dashboard",
                },
                {
                  name: "Create checker",
                },
              ]}
            />

            <div className="flex flex-col">
              <h1 className="mb-4 mt-4 font-mackinac text-3xl font-bold">
                {/* <span className="border-b-2 border-blue-300"> */}
                Create Checker
              </h1>

              <label className="mb-1 ml-1 text-lg font-bold">Name</label>
              <Input
                placeholder="Grammar Checker"
                onChange={(e) => {
                  setSubmittingState(SubmittingState.ChangesDetected);
                  setName(e.target.value);
                }}
                value={name}
                maxLength={MAX_CHECKER_NAME_LEN}
              />

              <label className="ml-1 mt-4 text-lg font-bold">Description</label>
              <NormalTextArea
                placeholder={"description"}
                onChange={(e) => {
                  setSubmittingState(SubmittingState.ChangesDetected);
                  setDesc(e.target.value);
                }}
                value={desc}
                minRows={4}
                maxLength={MAX_CHECKER_DESC_LEN}
              />

              <LabelWithHelp
                className="ml-1 mt-4 text-lg font-bold"
                label="Example Document with mistakes"
                helpText="Use this to test your prompt."
                helpIconClassName="mt-[7px]"
              />
              <Editor
                storefront={{
                  objInfo: {
                    name: name,
                    desc: desc,
                    id: originalChecker.id,
                    creatorId: userCtx.id ?? "",
                  },
                  placeholder: "test",
                }}
              ></Editor>
              {/* <NormalTextArea
                                placeholder={`• Expedited DynamoDB queries from 68 ms to 41 ms by optimizing the schema for reads
• Unified request authorization logic by proxying requests through a Spring API Gateway`}
                                onChange={(e) => {
                                    setSubmittingState(
                                        SubmittingState.ChangesDetected,
                                    );
                                    setPlaceholder(e.target.value);
                                }}
                                value={placeholder}
                                minRows={4}
                                maxLength={MAX_CHECKER_PLACEHOLDER_LEN}
                            /> */}

              <div className="mt-4 flex flex-row">
                <IsValidWarning name={name} desc={desc} prompt={prompt} />
                <IsPublicSwitch
                  checkerId={originalChecker.id}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                />
                <div className="ml-4">{SaveStatusText[submittingState]}</div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row space-x-8">
                  <NormalButton
                    className="mt-4 h-10 w-52"
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                  >
                    Return to Dashboard
                  </NormalButton>
                  <NormalButton
                    className="mx-auto mt-4 h-10 px-6"
                    onClick={() => {
                      router.push(`/editor/${originalChecker.id}`);
                    }}
                  >
                    Open checker in editor
                  </NormalButton>
                </div>
              </div>
              <div className="h-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
