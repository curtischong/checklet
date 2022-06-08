import { Structure } from "@components/structure";
import { TextboxContainer } from "@components/textbox/textboxcontainer";
import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    NavLink,
} from "react-router-dom";

type TabProps = {
    displayName: string;
    hrefName: string;
};

const tabProps: TabProps[] = [
    {
        displayName: "bullet points",
        hrefName: "/",
    },
    {
        displayName: "structure",
        hrefName: "structure",
    },
];

const tabStyles = `nav-link block
font-medium
text-xs
leading-tight
uppercase
border-x-0 border-t-0 border-b-2 border-transparent
px-6
py-3
my-2
hover:border-transparent hover:bg-gray-100
focus:border-transparent
active
`;

export const AppNav: React.FC = () => {
    return (
        <div>
            <Router>
                <nav>
                    <ul
                        className="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4"
                        id="tabs-tab"
                        role="tablist"
                    >
                        {tabProps.map((tab) => (
                            <li className="nav-item">
                                <NavLink
                                    className={tabStyles}
                                    to={tab.hrefName}
                                >
                                    {tab.displayName}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<TextboxContainer />}></Route>
                    <Route path="/structure" element={<Structure />}></Route>
                </Routes>
            </Router>
        </div>
    );
};
