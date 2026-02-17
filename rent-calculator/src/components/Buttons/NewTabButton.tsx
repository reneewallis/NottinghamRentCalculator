import React from "react";
import { NewTabButtonProps } from "@/src/Types/Buttons";

function NewTabButton({onClick}: NewTabButtonProps){
    return(
    <button key={"newTabButton"} className={"flex justify-center items-center h-9 w-9 my-1 text-gray-200 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer hover:bg-fuchsia-700 hover:text-gray-50"} onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.25} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    </button>
    );
}

export default NewTabButton;