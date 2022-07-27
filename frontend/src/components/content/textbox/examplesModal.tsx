import { Modal } from "antd";
import React from "react";
import { AiOutlineCopy } from "react-icons/ai";

export type ExamplesModalProps = {
    onClick: (text: string) => void;
    onClose: () => void;
    visible: boolean;
};

const examples = [
    "Developed generic ML pipeline interface, enabling major codebase refactor to 5+ different pipelines, allowing for easier readability and maintainability of current pipeline architectures",
    "Capital One - January 2022 to April 2022 - Refactored modules to improved our engine’s performance by 30%. - Designed and built a new React web application to amalgamate three core client workflows into one tool, with emphasis on ease of use, and improved functionality",
    "Selected a storage engine by creating a benchmark testing suite tracking latency and memory per operation, as well as total disk usage for various key value stores",
    "Our January Our February Our March our our our our our our USA",
];

export const ExamplesModal: React.FC<ExamplesModalProps> = (
    props: ExamplesModalProps,
) => {
    const { visible, onClose, onClick } = props;

    return (
        <Modal
            title="Examples"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {examples.map((example, index) => {
                return (
                    <div className="grid grid-cols-10 pb-2" key={index}>
                        <div className="col-span-9">{example}</div>
                        <div className="col-span-1 mt-0.5">
                            <AiOutlineCopy
                                className="float-right"
                                size={18}
                                onClick={() => onClick(example)}
                            />
                        </div>
                    </div>
                );
            })}
        </Modal>
    );
};
