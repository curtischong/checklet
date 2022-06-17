import React, { useEffect, useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import {
    DragDropContext,
    Droppable,
    DroppableProvided,
    DraggableProvided,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import css from "./structure.module.scss";

export enum SectionTypes {
    WORK = "Work Experience",
    VOLUNTEERING = "Volunteering",
    SKILLS = "Skills",
    EDUCATION = "Education",
    AWARDS = "Awards",
}

type SectionMetadata = {
    sectionType: SectionTypes;
    isSelected: boolean;
};

const defaultSections: SectionMetadata[] = [
    {
        sectionType: SectionTypes.WORK,
        isSelected: true,
    },
    {
        sectionType: SectionTypes.VOLUNTEERING,
        isSelected: true,
    },
    {
        sectionType: SectionTypes.SKILLS,
        isSelected: true,
    },
    {
        sectionType: SectionTypes.EDUCATION,
        isSelected: true,
    },
    {
        sectionType: SectionTypes.AWARDS,
        isSelected: true,
    },
];

export const Structure: React.FC = () => {
    const [sections, setSections] = useState(defaultSections);
    const [suggestedOrder, setSuggestedOrder] = useState([]);

    const handleDrop = (droppedItem: DropResult) => {
        if (!droppedItem.destination) return;
        const updatedList = [...sections];
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        setSections(updatedList);
    };

    useEffect(() => {
        analyzeOrder();
    }, [sections]);

    const analyzeOrder = async () => {
        // TODO: change to Axios
        const response = await fetch(
            "http://localhost:5000/resumes/structure/suggestions",
            {
                method: "POST",
                body: JSON.stringify({ structure: sections }),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        const data = await response.json();
        setSuggestedOrder(data.structure);
    };

    const handleCheckboxChange = (index: number) => {
        const items = [...sections];
        items[index].isSelected = !items[index].isSelected;
        setSections(items);
    };

    return (
        <div className="flex-1 container my-8 max-w-screen-lg mx-auto p-5">
            <div className="grid grid-cols-2 gap-4 p-5">
                <div className="grid">
                    <div className="font-bold pb-5">
                        {" "}
                        Order your resume sections from top to bottom{" "}
                    </div>
                    <DragDropContext onDragEnd={handleDrop}>
                        <Droppable droppableId="list-container">
                            {(provided: DroppableProvided) => (
                                <div
                                    className="list-container"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {sections.map((item, index) => (
                                        <Draggable
                                            key={item.sectionType}
                                            draggableId={item.sectionType}
                                            index={index}
                                        >
                                            {(
                                                providedDrag: DraggableProvided,
                                            ) => (
                                                <div
                                                    className="flex pb-1"
                                                    ref={providedDrag.innerRef}
                                                    {...providedDrag.dragHandleProps}
                                                    {...providedDrag.draggableProps}
                                                >
                                                    <div className="flex my-auto pr-3">
                                                        <MdDragIndicator color="gray" />
                                                        <input
                                                            className="my-auto"
                                                            type="checkbox"
                                                            checked={
                                                                item.isSelected
                                                            }
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    index,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {item.sectionType}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className="grid">
                    <>
                        <div className="font-bold pb-5"> Suggested Order </div>
                        <div>
                            {suggestedOrder.map((item: string, idx: number) => (
                                <div key={idx} className="flex pb-1">
                                    <div
                                        style={{
                                            backgroundColor:
                                                item ===
                                                sections[idx].sectionType
                                                    ? "white"
                                                    : "#DCBAB9",
                                        }}
                                        className={css.suggestedOrder}
                                    >
                                        {item}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
};
