import { Check } from "@components/create-checker/Check";
import React from "react";

interface Props {
    onCreate: (check: Check) => void;
}
export const CheckCreator = ({ onCreate }: Props): JSX.Element => {
    const [name, setName] = React.useState("");
    const [shortDesc, setShortDesc] = React.useState("");
    const [longDesc, setLongDesc] = React.useState("");
    const [category, setCategory] = React.useState("");

    // TODO: we should have a demo card that appears as you fill in the fields (it'll be on the right side)
    return (
        <div className="flex flex-row">
            <div className="flex flex-col">
                <h1>Create Check</h1>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <label>Short Description</label>
                <input
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                />
                <label>Long Description (optional)</label>
                <input
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                />
                <label>Category (optional)</label>
                <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button
                    onClick={() =>
                        onCreate({
                            name,
                        })
                    }
                >
                    Submit
                </button>
            </div>
            <div>
                <h1>todo: preview card</h1>
            </div>
        </div>
    );
};
