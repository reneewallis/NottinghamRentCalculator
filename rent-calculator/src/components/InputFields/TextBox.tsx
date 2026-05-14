import { TextBoxProps } from "../../types/InputFields";
import React from "react";
import { fluidCSSWidthScale } from "@/src/utils/HelperFunctions";
import { DEFAULT_TEXT_BOX_WIDTH, MAX_TEXT_BOX_WIDTH_SCALE, MIN_TEXT_BOX_WIDTH_SCALE } from "./inputFieldConsts";

function TextBox(props: TextBoxProps) {
    const {
        label,
        text,
        readOnly,
        alignment = "left",
        width = DEFAULT_TEXT_BOX_WIDTH,
        valid = true,
    } = props;
    let alignmentString;

    switch (alignment) {
        case "left": {
            alignmentString = "text-left items-start";
            break;
        }
        case "center": {
            alignmentString = "text-center items-center";
            break;
        }
        case "right": {
            alignmentString = "text-right items-end";
            break;
        }
    }
    return (
        <label
            className={`inline-flex flex-col text-gray-200 text-base md:text-lg lg:text-2xl whitespace-nowrap ${alignmentString} focus-within:font-semibold hover:text-gray-100 focus-within:text-gray-50 transition-colors`}
        >
            <span className="w-fit h-fit mb-1.25 md:mb-2 lg:mb-3 cursor-pointer">
                {label}
            </span>
            <textarea
                style={{ width: fluidCSSWidthScale(`${width*MIN_TEXT_BOX_WIDTH_SCALE}rem`,`${width}rem`,`${width*MAX_TEXT_BOX_WIDTH_SCALE}rem`)}}
                className={`resize-none rounded-2xl py-2.5 px-3 border-2 font-normal ${valid ? "border-gray-300 hover:border-gray-100 focus:border-gray-50" : "border-red-600 hover:border-red-500 focus-within:border-red-500"} focus:outline-none transition-colors ${readOnly ? "bg-gray-800" : "bg-gray-700 hover:bg-gray-800 focus:bg-gray-900"}`}
                value={text}
                {...(!readOnly && { onChange: props.onChange })}
                readOnly={readOnly}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                rows={1}
                maxLength={7}
            ></textarea>
        </label>
    );
}

export default TextBox;
