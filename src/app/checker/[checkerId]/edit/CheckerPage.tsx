"use client";
import { NormalButton } from "@/app/_components/ui/Button";
import { Input } from "@/app/_components/ui/Input";
import { NavigationPath } from "@/app/_components/ui/NavigationPath";
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import {
  SaveStatusText,
  SubmittingState,
} from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { IsPublicSwitchWithoutState } from "@/app/checker/[checkerId]/edit/IsPublicSwitch";
import { isValidWarning } from "@/app/checker/[checkerId]/edit/IsValidWarning";
import useUnsavedChangesWarning from "@/app/checker/[checkerId]/edit/useUnsavedChangesWarning";
import { Editor } from "@/app/checker/[checkerId]/editor/Editor";
import { MAX_CHECKER_DESC_LEN, MAX_CHECKER_NAME_LEN } from "@/constants";
import { type UserCtx } from "@/firebase/edge_env";
import { api, apiClient, handleErr } from "@/trpc/react";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

export enum Page {
  Main,
  CheckCreator,
}

interface Props {
  // originalChecker: Checker;
  userCtx: UserCtx;
  checkerId: string;
}

export const CheckerPage = ({
  // originalChecker,
  userCtx,
  checkerId,
}: Props): JSX.Element => {
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const [editorState, setEditorState] = React.useState("");
  const [submittingState, setSubmittingState] = React.useState(
    SubmittingState.NotSubmitting,
  );
  const [isPublic, setIsPublic] = React.useState(false);

  useEffect(() => {
    handleErr(
      apiClient.checker.getUserChecker.query({ checkerId }),
      (checker) => {
        setName(checker.name);
        setDesc(checker.desc);
        setPrompt(checker.prompt);
        setEditorState(checker.sampleDoc);
        setIsPublic(checker.isPublic);
      },
    );
  }, [checkerId]);

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
          id: checkerId,
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
  const isFormDirty = submittingState !== SubmittingState.NotSubmitting;
  useUnsavedChangesWarning({ hasUnsavedChanges: isFormDirty });

  const isInvalidWarningMsg = isValidWarning(name, desc, prompt);

  return (
    <div className={`mt-2 flex flex-col justify-center p-10`}>
      <div
        className="mx-20 flex flex-grow flex-col"
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
          <h1 className="mt-4 font-mackinac text-3xl font-bold">
            {/* <span className="border-b-2 border-blue-300"> */}
            Create Checker
          </h1>

          <div className="mt-4 flex flex-row space-x-8">
            <IsPublicSwitchWithoutState
              checkerId={checkerId}
              isPublic={isPublic}
              setIsPublic={setIsPublic}
            />
            <div className="ml-4">{SaveStatusText[submittingState]}</div>
          </div>

          <label className="mb-1 ml-1 mt-4 text-lg font-bold">Name</label>
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

          <h2 className="mt-8 text-center font-mackinac text-2xl">
            Test your checker below!
          </h2>
        </div>
      </div>
      <Editor
        checkerStorefront={{
          name: name,
          desc: desc,
          checkerId: checkerId,
          creatorId: userCtx.id,
          placeholder: "place your test document here",
        }}
        isFocusedOnStart={false}
        isSavingToLocalStorage={false} // since we are already saving it to the checker
        editorState={editorState}
        setEditorState={setEditorState}
      />
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
            router.push(`/checker/${checkerId}`);
          }}
        >
          Open checker in editor
        </NormalButton>
      </div>
    </div>
  );
};
