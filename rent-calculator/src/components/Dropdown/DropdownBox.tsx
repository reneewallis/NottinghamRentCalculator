"use client";

import React, {useState} from "react";
import { DropdownItem, DropdownBoxProps } from "@/src/Types/Dropdown";

function CustomDropdownBox({label, boxText, items}:DropdownBoxProps){
    const [showItems, setShowItems] = useState(false);

    const maxLabelLength = items.length > 0 ? Math.max(label.length, ...items.map(item => item.label.length)): label.length;
    const buttonWidth = (maxLabelLength * 1.2);
    console.log("Button Width: ", buttonWidth);

    return(
        <div className="relative w-fit">
            <button style={{ minWidth : `${buttonWidth}rem`}} key={`dropdown ${label}`} className="flex justify-between items-center p-2 bg-gray-900 border-2 border-gray-200 rounded-2xl whitespace-nowrap cursor-pointer" onClick={() => setShowItems(!showItems)}>
                <div className="text-2xl font-semibold text-left p-2">
                    {boxText}
                </div>
                <div key={"arrow"} className="translate-y-1 ml-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </button>
            {showItems&&<div className="absolute z-10 mt-1.5 p-1 w-full flex flex-col rounded-2xl bg-gray-900 inset-shadow-sm border-2 border-gray-200 opacity-90">
                {items.map((item:DropdownItem, index:number) =>(
                    <button key={`item${index}`} className="whitespace-nowrap pt-0.5 pb-1 pl-2 pr-2 text-left text-gray-200 rounded-2xl hover:bg-fuchsia-700 hover:text-gray-50" onClick={() => {if (item.onClick){item.onClick()}; setShowItems(false)}}>{item.label}</button>
                ))}
            </div>}
        </div>
    );
}

export default CustomDropdownBox;