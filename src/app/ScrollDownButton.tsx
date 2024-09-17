"use client";
import { DownArrowWithTailIcon } from "@/app/_components/icons/DownArrowWithTailIcon";

export const ScrollDownButton = () => {
    return (
                    <div
                        className="border-[2px] border-gray-500 hover:border-gray-600 rounded-[100px] w-[40px] h-[40px] absolute bottom-8 left-[calc(50%-20px)] cursor-pointer"
                        onClick={() =>
                            window.scrollBy({
                                left: 0,
                                top: window.innerHeight,
                                behavior: "smooth",
                            })
                        }
                    >
                        <DownArrowWithTailIcon className="mx-auto mt-[5px]" />
                    </div>
    )
}