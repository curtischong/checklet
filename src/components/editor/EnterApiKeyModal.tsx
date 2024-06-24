import { SubmitButton } from "@components/Button";
import { ModelType } from "@components/create-checker/CheckerTypes";
import { SetState } from "@utils/types";
import { Input, Modal } from "antd/lib";
import { useCallback, useEffect, useState } from "react";
interface Props {
    isOpen: boolean;
    setIsOpen: SetState<boolean>;
    updateModelType: (newModelType: ModelType) => void;
}

export const EnterApiKeyModal = ({
    isOpen,
    setIsOpen,
    updateModelType,
}: Props): JSX.Element => {
    const [apiKey, setApiKey] = useState("");
    const [apiKeyExists, setApiKeyExists] = useState(false);
    useEffect(() => {
        const existingApiKey = localStorage.getItem("openai-api-key");
        if (existingApiKey) {
            setApiKeyExists(true);
        }
        setApiKey(existingApiKey ?? "");
    }, []);

    const submitApiKey = useCallback(() => {
        if (apiKey !== "") {
            localStorage.setItem("openai-api-key", apiKey);
            setIsOpen(false);
        }
    }, [apiKey]);
    return (
        <Modal
            title="Improve your results with GPT4"
            open={isOpen}
            onCancel={() => {
                setIsOpen(false);
                if (apiKey === "") {
                    updateModelType(ModelType.GPT35);
                }
            }}
            footer={null}
        >
            <div>
                {apiKeyExists
                    ? "If you want to change your API key, paste it below. Otherwise, you're good!"
                    : "Paste your OpenAI API key to run the checker using GPT-4o."}
                <br />
                <br />
                <span className="font-bold">Note: </span>Your API key{" "}
                <span className="border-b-[2px] border-blue-500">
                    never leaves your computer
                </span>
                .
            </div>

            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                    submitApiKey();
                }}
            >
                <Input
                    className="mt-4"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-k39GL3lk269KDgs..."
                    type="password"
                />
            </form>
            <SubmitButton
                disabled={apiKey === ""}
                className="py-1 mt-4"
                onClick={submitApiKey}
            >
                Use Api Key
            </SubmitButton>
        </Modal>
    );
};
