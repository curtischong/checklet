"use client";
import { NormalButton } from "@/app/_components/ui/Button";
import { Input } from "@/app/_components/ui/Input";
import { LabelWithHelp } from "@/app/_components/ui/LabelWithHelp";
import { NavigationPath } from "@/app/_components/ui/NavigationPath";
import { NormalTextArea } from "@/app/_components/ui/TextArea";
import { AccessTypeSelectorWithoutState } from "@/app/checker/[checkerId]/edit/AccessTypeSelector";
import {
  SaveStatusText,
  SubmittingState,
} from "@/app/checker/[checkerId]/edit/CheckerTypes";
import { defaultImprovementPrompt } from "@/app/checker/[checkerId]/edit/DefaultPrompts";
import ImprovePromptModal from "@/app/checker/[checkerId]/edit/ImprovePromptModal";
import { isValidWarning } from "@/app/checker/[checkerId]/edit/IsValidWarning";
import useUnsavedChangesWarning from "@/app/checker/[checkerId]/edit/useUnsavedChangesWarning";
import { Editor } from "@/app/checker/[checkerId]/editor/Editor";
import { useTrpcCtx } from "@/app/TrpcCtx";
import { MAX_CHECKER_DESC_LEN, MAX_CHECKER_NAME_LEN } from "@/constants";
import { type UserCtx } from "@/firebase/edge_env";
import { handleErr } from "@/trpc/react";
import { AccessType } from "@prisma/client";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

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
  const [accessType, setAccessType] = React.useState<AccessType>(
    AccessType.PRIVATE,
  );
  const [isInitialCheckerFetched, setIsInitialCheckerFetched] =
    React.useState(false);

  const [clonedFromId, setClonedFromId] = React.useState<string | null>(null);
  const [improvementPrompt, setImprovementPrompt] = React.useState(
    defaultImprovementPrompt,
  );
  const [improvedPrompt, setImprovedPrompt] = React.useState("");

  const { trpcClient } = useTrpcCtx();

  useEffect(() => {
    handleErr(
      trpcClient.checker.getUserChecker.query({ checkerId }),
      (checker) => {
        setName(checker.name);
        setDesc(checker.desc);
        setPrompt(checker.prompt);
        setEditorState(checker.sampleDoc);
        setAccessType(checker.accessType);
        setIsInitialCheckerFetched(true);
        setClonedFromId(checker.clonedFromId);
      },
    );
  }, [checkerId]);

  const router = useRouter();

  const saveChecker = useCallback(
    debounce(
      (
        newName: string,
        newDesc: string,
        newPrompt: string,
        newSampleDoc: string,
      ) => {
        // only update the checker if we've fetched the initial checker (so we don't accidentally clear the checker on startup)
        if (!isInitialCheckerFetched) {
          return;
        }

        // PERF: this sends an extra mutate command when we first start up the checker.
        setSubmittingState(SubmittingState.Submitting);
        handleErr(
          trpcClient.checker.update.mutate({
            id: checkerId,
            name: newName,
            desc: newDesc,
            prompt: newPrompt,
            sampleDoc: newSampleDoc,
          }),
          () => {
            setSubmittingState(SubmittingState.NotSubmitting);
          },
          () => {
            setSubmittingState(SubmittingState.ChangesDetected);
          },
        );
      },
      1000,
    ),
    [isInitialCheckerFetched],
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
            <AccessTypeSelectorWithoutState
              checkerId={checkerId}
              accessType={accessType}
              setAccessType={setAccessType}
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

          <LabelWithHelp
            className="ml-1 mt-4 text-lg font-bold"
            label="Description"
            helpText="This uses Markdown syntax. (so you can bold text, make lists, underline etc.)"
          ></LabelWithHelp>
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
            label="Prompt"
            helpText="Write down all of the tips you use for this type of writing! We tell AI to watch for these things when checking documents"
          ></LabelWithHelp>
          <ImprovePromptModal
            prompt={prompt}
            improvementPrompt={improvementPrompt}
            setImprovementPrompt={setImprovementPrompt}
            improvedPrompt={improvedPrompt}
            setImprovedPrompt={setImprovedPrompt}
          />
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
          clonedFromId: clonedFromId,
          sampleDoc: editorState,
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
