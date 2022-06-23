import { Tabs } from "antd";
import { Structure } from "@components/structure";
import { Content } from "@components/content/content";
import React from "react";
import classnames from "classnames";
import "./navigation.module.scss";

const { TabPane } = Tabs;

type TabProps = {
    displayName: React.ReactNode;
    key: string;
    element: React.ReactNode;
};

const tabProps: TabProps[] = [
    {
        displayName: "Content",
        key: "content",
        element: <Content />,
    },
    {
        displayName: "Structure",
        key: "structure",
        element: <Structure />,
    },
];

export const AppNav: React.FC = () => {
    return (
        <div className="card-container">
            <Tabs className={classnames("px-10")} defaultActiveKey="content">
                {tabProps.map((tab) => (
                    <TabPane tab={tab.displayName} key={tab.key}>
                        {tab.element}
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};
