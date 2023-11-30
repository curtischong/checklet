import { Affix } from "antd";
import classnames from "classnames";
import React, { ReactNode } from "react";
import css from "./containerHeader.module.scss";
import { getAccessCode } from "@utils";
import { ExamplesModal } from "@components/editor/textbox/examplesModal";
import { LoadingButton } from "@components/Button";

export type ContainerHeaderProps = {
    header: ReactNode;
};

export const ContainerHeader: React.FC<ContainerHeaderProps> = (
    props: ContainerHeaderProps,
) => {
    return (
        <Affix offsetTop={0}>
            <div className={classnames(css.header)}>

            <div className="pb-6 flex flex-row">
                <div className="font-bold my-auto">Checker Name</div>
                {/* deprecated
                <div
                    onClick={this.showAccessCodeModal}
                    className="italic nautilus-text-blue m-auto hover:underline"
                >
                    {" "}
                    Want an access code?{" "}
                </div>
                <AccessCodeModal
                    onClose={this.closeAccessCodeModal}
                    visible={this.state.isAccessCodeModalVisible}
                /> */}

                {getAccessCode() === "admin" && (
                    <div
                        onClick={this.showExamplesModal}
                        className="italic nautilus-text-blue m-auto hover:underline"
                    >
                        {" "}
                        Examples
                    </div>
                )}

                <ExamplesModal
                    onClose={this.closeExamplesModal}
                    visible={this.state.isExampleCodeModalVisible}
                    onClick={this.handleExampleClicked}
                />

                <LoadingButton
                    onClick={this.checkDocument}
                    loading={this.state.loading}
                    className="h-9 float-right ml-32"
                >
                    Check Document
                </LoadingButton>
            </div>
            </div>
        );
    };

        </Affix>
    );
};
