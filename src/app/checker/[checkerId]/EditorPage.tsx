"use client";
import { Editor } from "@/app/checker/[checkerId]/editor/Editor";
import { type GetCheckerByIdType } from "@/server/api/routers/checker/checker";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  checker: NonNullable<GetCheckerByIdType>;
}

export const EditorPage = ({ checker }: Props) => {
  const [editorState, setEditorState] = React.useState("");
  const router = useRouter();

  useEffect(() => {
    void router.push(`#${checker.name}`);
  }, [router, checker]);
  return (
    <div className="mx-10">
      <Editor
        checkerStorefront={{
          name: checker.name,
          desc: checker.desc,
          checkerId: checker.id,
          creatorId: checker.createdById,
          placeholder: "place your document here",
        }}
        isSavingToLocalStorage={true}
        isFocusedOnStart={true}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  );
};
