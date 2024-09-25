import { Editor } from "@/app/checker/[checkerId]/editor/Editor";
import { type GetCheckerByIdType } from "@/server/api/routers/checker/checker";
import React from "react";

interface Props {
  checker: GetCheckerByIdType;
}

export const EditorPage = ({ checker }: Props) => {
  const [editorState, setEditorState] = React.useState("");
  return (
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
  );
};
