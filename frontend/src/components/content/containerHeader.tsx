import { Affix } from "antd";
import classnames from "classnames";
import React, { ReactNode } from "react";
import css from "./containerHeader.module.scss";

export type ContainerHeaderProps = {
    header: ReactNode;
};

export const ContainerHeader: React.FC<ContainerHeaderProps> = (
    props: ContainerHeaderProps,
) => {
    return (
        <Affix offsetTop={0}>
            <div className={classnames(css.header)}>{props.header}</div>
        </Affix>
    );
};
