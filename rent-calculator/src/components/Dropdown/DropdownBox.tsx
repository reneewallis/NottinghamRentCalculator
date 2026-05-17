"use client";

import React, { useState } from "react";
import { DropdownBoxProps } from "@/src/types/Dropdown";
import { fluidCSSWidthScale } from "@/src/utils/helperFunctions";
import { DEFAULT_DROPDOWN_LABEL_SCALE, MAX_DROPDOWN_WIDTH_SCALE, MIN_DROPDOWN_WIDTH_SCALE, SMALL_DROPDOWN_LABEL_SCALE } from "./dropdownConstants";

function CustomDropdownBox<TLabel extends string>(
    props: DropdownBoxProps<TLabel>,
) {
    const {
        label,
        items,
        minWidth,
        small = false,
        valid = true,
        controlled,
    } = props;

    const [showItems, setShowItems] = useState(false);
    const [boxText, setBoxText] = useState(label);

    let buttonWidth;
    if (minWidth) {
        buttonWidth = minWidth;
    } else {
        const maxLabelLength =
            items.length > 0
                ? Math.max(
                      label.length,
                      ...items.map((item) => item.label.length),
                  )
                : label.length;
        if (!small) {
            buttonWidth = maxLabelLength * DEFAULT_DROPDOWN_LABEL_SCALE;
        } else {
            buttonWidth = maxLabelLength * SMALL_DROPDOWN_LABEL_SCALE;
        }
    }
    const boxLabel = controlled ? props.value : boxText;

    return (
        <div className="relative inline-flex flex-col items-center">
            <button
                style={{ minWidth: fluidCSSWidthScale(`${buttonWidth * MIN_DROPDOWN_WIDTH_SCALE}rem`, `${buttonWidth}rem`, `${buttonWidth * MAX_DROPDOWN_WIDTH_SCALE}rem`) }}
                key={`dropdown ${label}`}
                className={`inline-flex justify-between items-center ${small ? "py-2 lg:py-3 gap-1" : "py-5 lg:py-6 gap-2"} pl-4 border-2 rounded-3xl cursor-pointer transition-colors ${showItems ? `text-gray-100 font-semibold bg-gray-800 hover:bg-gray-900 hover:text-gray-50 ${valid ? "border-gray-100 hover:border-gray-50" : "border-red-500"}` : `text-gray-200 bg-gray-700 hover:bg-gray-800 hover:text-gray-100 ${valid ? "border-gray-300 hover:border-gray-200" : "border-red-600"}`}`}
                onClick={() => setShowItems(!showItems)}
            >
                <div
                    key={"boxLabel"}
                    className={`${small ? "text-base md:text-lg lg:text-2xl wrap-break-word whitespace-normal" : "text-lg md:text-xl lg:text-3xl whitespace-nowrap"} text-left`}
                >
                    {small? boxLabel.split(" ").map((word,index) => (
                        <span key={index} className="block">
                            {word}
                        </span>
                    )): boxLabel}
                </div>
                <div key={"arrow"} className="translate-y-0.5 lg:translate-y-1 pr-1.5 mr-2.5">
                    {showItems ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="size-4 md:size-5 lg:size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 15.75 7.5-7.5 7.5 7.5"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="size-5 md:size-6 lg:size-7"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    )}
                </div>
            </button>
            {showItems && (
                <div className="absolute top-full z-10 mt-1.5 p-1 w-full flex flex-col rounded-3xl bg-gray-800 inset-shadow-sm border-2 border-gray-100 hover:border-gray-50 opacity-90">
                    {items.map((item, index) => (
                        <button
                            key={`item${index}`}
                            className="whitespace-nowrap text-base md:text-lg lg:text-xl pt-0.5 pb-1 pl-2 pr-2 text-left text-gray-100 rounded-2xl hover:bg-fuchsia-700 hover:text-gray-50 hover:font-semibold cursor-pointer"
                            onClick={() => {
                                if (item.onClick) {
                                    item.onClick();
                                }
                                if (!controlled) {
                                    setBoxText(item.label);
                                }
                                setShowItems(false);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomDropdownBox;
