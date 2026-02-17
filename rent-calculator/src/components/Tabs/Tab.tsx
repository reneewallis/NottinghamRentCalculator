import { TabProps } from "@/src/Types/Tab";
import React from "react";

function Tab({label, id, active = false, onClick = ()=>{}, onClose = ()=>{}}:TabProps){
    return (
    <div key = {`tab${id}`} className={`flex justify-between items-center mt-2 rounded-t-lg focus:outline-none transition-colors font-medium text-sm duration-200 ${active ? "border-b-2  border-b-gray-800 text-gray-200 bg-gray-600": "text-gray-300 hover:text-fuchsia-700 hover:bg-gray-800 hover:opacity-90"}`}>
        <button key = {`tabButton${id}`} className={"py-3 pl-4 pr-1.5 cursor-pointer transition-colors duration-200 focus:outline-none"} onClick = {onClick}>
            {label}
        </button>
        <button key={`closeButton${id}`} className={"flex justify-center items-center w-6 h-6 my-2 mx-0.5 rounded-full font-semibold  text-center cursor-pointer transition-colors duration-200 focus:outline-none hover:bg-fuchsia-700 hover:text-gray-50"} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
    );
}

export default Tab;