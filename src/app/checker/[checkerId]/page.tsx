import { getCheckerById } from "@/server/api/routers/checker/checker";
import { db } from "@/server/db";

export default async function Page({
  params,
}: {
  params: { checkerId: string };
}) {
  const checker = await getCheckerById(db, params.checkerId);

  // useEffect(() => {
  //   // TODO: only do this on the checker page
  //   // editorRef?.current?.focus();
  //   // const prevDocument = localStorage.getItem("editorText");
  //   // if (prevDocument) {
  //   //   updateEditorState(prevDocument);
  //   // }
  //   // not sure why updateEditorState keeps changing. but it does. But we only want this useEffect to run once
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <EditorPage editorState={editorState} setEditorState={setEditorState} />
  );
}
