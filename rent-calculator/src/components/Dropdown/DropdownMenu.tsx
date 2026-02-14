"use client";

import { DropdownMenuProps, DropdownItem } from "@/src/Types/Dropdown";
import React, {useState} from "react";

function DropdownMenu({items}:DropdownMenuProps){
    const [showMenu, setShowMenu] = useState(false);

    return(
        <div className="relative">
            <button key={"menuButton"} className={"flex justify-center items-center h-9 w-9 my-1 text-gray-200 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer hover:bg-fuchsia-700 hover:text-gray-50 bg-opacity-30"} onClick={() => {setShowMenu(!showMenu)}}>
                {showMenu?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                }
            </button>
            {showMenu&&<div className="absolute right-0 z-10 inline-flex flex-col rounded-lg bg-gray-600 inset-shadow-sm border-2 border-gray-200">
                {showMenu && items.map((menuItem:DropdownItem, index:number) =>(
                    <button key={`item${index}`} className="whitespace-nowrap w-full pt-0.5 pb-1 pl-1 pr-2 text-left text-gray-200 rounded-lg hover:bg-fuchsia-700 hover:text-gray-50" onClick={() => {menuItem.onClick(menuItem.label)}} >{menuItem.label}</button>
                ))}
            </div>}
        </div>
    )
}

export default DropdownMenu;