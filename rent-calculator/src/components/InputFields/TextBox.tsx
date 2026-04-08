import { TextBoxProps } from "../../types/InputFields";
import React from "react";

function TextBox(props: TextBoxProps) {
  const {
    label,
    text,
    readOnly,
    alignment = "left",
    width = 11.25,
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
      className={`inline-flex flex-col text-gray-200 text-2xl whitespace-nowrap ${alignmentString} focus-within:font-semibold hover:text-gray-100 focus-within:text-gray-50 transition-colors`}
    >
      <span className="w-fit h-fit mb-3 mr-1.5 cursor-pointer">{label}</span>
      <textarea
        style={{ width: `${width}rem` }}
        className={`resize-none rounded-2xl py-2.5 px-3 border-2 font-normal ${valid ? "border-gray-300 hover:border-gray-100 focus:border-gray-50" : "border-red-600 hover:border-red-500 focus-within:border-red-500"} focus:outline-none transition-colors ${readOnly ? "bg-gray-800" : "bg-gray-700 hover:bg-gray-800 focus:bg-gray-900"}`}
        value={text}
        {...(!readOnly && { onChange: props.onChange })}
        readOnly={readOnly}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        cols={14}
        rows={1}
        maxLength={8}
      ></textarea>
    </label>
  );
}

export default TextBox;
