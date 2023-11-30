import { CheckerStore } from "@components/CheckerStore";
import React from "react";

const EditorHome: React.FC = () => {
    return (
        <div>
            <div>What do you want to check?</div>
            <CheckerStore />
        </div>
    );
};

export default EditorHome;
