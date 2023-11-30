import React from "react";
import { Editor } from "@components/editor/Editor";
import { Api } from "@api/apis";

const EditorPage: React.FC = () => {
    // TODO: check if checker exists
    // useEffect(() => {
    //     Api.doesCheckerExist();
    // }, []);
    return <Editor />;
};

export default EditorPage;
