"use client";
import { Editor } from "@/app/checker/[checkerId]/editor/Editor";
import { type GetCheckerByIdType } from "@/server/api/routers/checker/checker";
import React from "react";

interface Props {
  checker: NonNullable<GetCheckerByIdType>;
}

export const EditorPage = ({ checker }: Props) => {
  const [editorState, setEditorState] = React.useState("");

  return (
    // try not to yolo add margin or padding here. since it will mess up the position of the suggestions box. add margine individually to the suggestion box and the textbox
    // look for marginTop: "30px", in Editor.tsx (this adds margin individually to the textbox)
    <div className={`mx-10 h-full`}>
      <Editor
        checkerStorefront={{
          name: checker.name,
          desc: checker.desc,
          checkerId: checker.id,
          creatorId: checker.createdById,
          placeholder: "place your document here",
          clonedFromId: checker.clonedFromId,
          sampleDoc: checker.sampleDoc,
        }}
        isSavingToLocalStorage={true}
        isFocusedOnStart={true}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  );
};
