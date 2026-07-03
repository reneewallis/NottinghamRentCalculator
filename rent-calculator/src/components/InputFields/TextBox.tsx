import { fluidCSSWidthScale } from "@/src/utils/helperFunctions";

import { TextBoxProps } from "../../types/InputFields";
import {
    DEFAULT_TEXT_BOX_WIDTH,
    MAX_TEXT_BOX_WIDTH_SCALE,
    MIN_TEXT_BOX_WIDTH_SCALE,
} from "./inputFieldConsts";

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
            className={`
              inline-flex flex-col text-base whitespace-nowrap text-gray-200
              md:text-lg
              lg:text-2xl
              ${alignmentString}
              transition-colors
              focus-within:font-semibold focus-within:text-gray-50
              hover:text-gray-100
            `}
        >
            <span className="
              mb-1.25 size-fit cursor-pointer
              md:mb-2
              lg:mb-3
            ">{label}</span>
            <textarea
                style={{
                    width: fluidCSSWidthScale(
                        `${width * MIN_TEXT_BOX_WIDTH_SCALE}rem`,
                        `${width}rem`,
                        `${width * MAX_TEXT_BOX_WIDTH_SCALE}rem`,
                    ),
                }}
                className={`
                  resize-none rounded-2xl border-2 px-3 py-2.5 font-normal
                  ${valid ? `
                    border-gray-300
                    hover:border-gray-100
                    focus:border-gray-50
                  ` : `
                    border-red-600
                    focus-within:border-red-500
                    hover:border-red-500
                  `}
                  transition-colors
                  focus:outline-none
                  ${readOnly ? `bg-gray-800` : `
                    bg-gray-700
                    hover:bg-gray-800
                    focus:bg-gray-900
                  `}
                `}
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
