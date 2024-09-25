import { Editor } from "@/app/checker/[checkerId]/editor/Editor";
import { type GetCheckerByIdType } from "@/server/api/routers/checker/checker";
import React, { useEffect } from "react";

interface Props {
  checker: GetCheckerByIdType;
}

export const EditorPage = ({ checker }: Props) => {
  const [editorState, setEditorState] = React.useState("");

  useEffect(() => {
    const prevDocument = localStorage.getItem("editorText");
    if (prevDocument) {
      setEditorState(prevDocument);
    }
    // not sure why updateEditorState keeps changing. but it does. But we only want this useEffect to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Editor
      checkerStorefront={{
        name: checker.name,
        desc: checker.desc,
        checkerId: checker.id,
        creatorId: checker.createdById,
        placeholder: "place your document here",
      }}
      isFocusedOnStart={true}
      editorState={editorState}
      setEditorState={setEditorState}
    />
  );
};
