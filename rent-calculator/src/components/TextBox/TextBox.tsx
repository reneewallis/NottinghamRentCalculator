"use client";

import { TextBoxProps } from "@/src/Types/TextBox";
import React from "react";


function TextBox(props:TextBoxProps){
    const {label, text, readOnly} = props
    return(
        <label className="inline-flex flex-col w-fit text-gray-200 text-xl text-left">
            <div className="ml-0.5">
                {label}
            </div>
            <textarea className={`resize-none rounded-xl mt-1.5 pl-1.5 py-1 border-2 border-gray-200 ${ readOnly? "bg-gray-700" : "bg-gray-600"}`} value={text} {...(!readOnly && { onChange: props.onChange })} readOnly={readOnly} spellCheck={false} autoComplete="off" autoCorrect="off" cols={12} rows={1} maxLength={8}></textarea>

        </label>
    )
}

export default TextBox;