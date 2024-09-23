"use client";
import { NormalButton } from "@/app/_components/ui/Button";
import { Input } from "@/app/_components/ui/Input";
import { LabelWithHelp } from "@/app/_components/ui/LabelWithHelp";
import { NavigationPath } from "@/app/_components/ui/NavigationPath";
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import {
  SaveStatusText,
  SubmittingState,
} from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { IsPublicSwitch } from "@/app/checker/[checkerId]/edit/IsPublicSwitch";
import { isValidWarning } from "@/app/checker/[checkerId]/edit/IsValidWarning";
import { Editor } from "@/app/checker/[checkerId]/editor/Editor";
import { MAX_CHECKER_DESC_LEN, MAX_CHECKER_NAME_LEN } from "@/constants";
import { type UserCtx } from "@/firebase/edge_env";
import { api } from "@/trpc/react";
import { type Checker } from "@prisma/client";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

export enum Page {
  Main,
  CheckCreator,
}

interface Props {
  originalChecker: Checker;
  userCtx: UserCtx;
}

export const CheckerPage = ({
  originalChecker,
  userCtx,
}: Props): JSX.Element => {
  const [name, setName] = React.useState(originalChecker.name);
  const [desc, setDesc] = React.useState(originalChecker.desc);
  const [prompt, setPrompt] = React.useState(originalChecker.prompt);
  const [editorState, setEditorState] = React.useState(
    originalChecker.sampleDoc,
  );
  const [submittingState, setSubmittingState] = React.useState(
    SubmittingState.NotSubmitting,
  );

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
      (
        newName: string,
        newDesc: string,
        newPrompt: string,
        newSampleDoc: string,
      ) => {
        // const checkerId =
        //     "1f981bc8190cc7be55aea57245e5a0aa255daea3e741ea9bb0153b23881b6161"; // use this if you want to test security rules
        updateChecker.mutate({
          id: originalChecker.id,
          name: newName,
          desc: newDesc,
          prompt: newPrompt,
          sampleDoc: newSampleDoc,
        });
      },
      1000,
    ),
    [],
  );

  useEffect(() => {
    saveChecker(name, desc, prompt, editorState);
  }, [name, desc, prompt, editorState, saveChecker]);

  const isInvalidWarningMsg = isValidWarning(name, desc, prompt);

  return (
    <div className={`mt-14 flex justify-center`}>
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
              <label className="ml-1 mt-4 text-lg font-bold">Prompt</label>
              <NormalTextArea
                placeholder={"what are the tips / tricks you use?"}
                onChange={(e) => {
                  setSubmittingState(SubmittingState.ChangesDetected);
                  setPrompt(e.target.value);
                }}
                value={prompt}
                minRows={8}
                maxLength={MAX_CHECKER_DESC_LEN}
              />

              {isInvalidWarningMsg != "" && (
                <div className="mt-4 max-w-80 rounded-md bg-red-200 px-2 py-1">
                  {isInvalidWarningMsg}
                </div>
              )}

              <LabelWithHelp
                className="ml-1 mt-4 text-lg font-bold"
                label="Test Your Checker below!"
                helpText="Use this to test your prompt."
                helpIconClassName="mt-[7px]"
              />
              <Editor
                checkerStorefront={{
                  name: name,
                  desc: desc,
                  checkerId: originalChecker.id,
                  creatorId: userCtx.id,
                  placeholder: "place your test document here",
                }}
                editorState={editorState}
                setEditorState={setEditorState}
              />

              <div className="mt-4 flex flex-row space-x-8">
                <IsPublicSwitch
                  checkerId={originalChecker.id}
                  isInitiallyPublic={originalChecker.isPublic}
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
