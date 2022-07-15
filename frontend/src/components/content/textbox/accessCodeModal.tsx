import { Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAccessCode, mixpanelTrack } from "../../../utils";

export type AccessCodeModalProps = {
    onClose: () => void;
    visible: boolean;
};

export const AccessCodeModal: React.FC<AccessCodeModalProps> = (
    props: AccessCodeModalProps,
) => {
    const { visible, onClose } = props;
    const router = useRouter();
    const [textCode, setTextCode] = useState("");

    useEffect(() => {
        setTextCode(getAccessCode() ?? "");
    }, []);

    const handleOk = () => {
        router.push({
            query: {
                accessCode: textCode,
            },
        });
        mixpanelTrack("Updated access code", {
            accessCode: textCode,
        });

        onClose();
    };

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setTextCode(e.target.value);
    };

    return (
        <Modal
            title="Access Code"
            visible={visible}
            onOk={handleOk}
            onCancel={onClose}
            okButtonProps={{ disabled: textCode === "" }}
        >
            Confirm your access code
            <Input value={textCode} onChange={onChange} />
        </Modal>
    );
};
