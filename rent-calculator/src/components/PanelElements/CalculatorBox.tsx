import React from "react";
import { CalculatorBoxProps } from "@/src/Types/PanelElements";
import CustomDropdownBox from "../Dropdown/DropdownBox";
import TextBox from "../TextBox/TextBox";

function CalculatorBox({dropDownProps, inputTextBoxProps, resultTextBoxes}: CalculatorBoxProps){
    return(
    <div className="inline-flex flex-row">
        <div className="inline-flex flex-col bg-gray-950 opacity-70 rounded-lg shadow-lg border-2 border-gray-50 py-9 pl-5 pr-8 w-fit">
            <CustomDropdownBox {...dropDownProps}></CustomDropdownBox>
            <div className="mt-10">
                <TextBox {...inputTextBoxProps}></TextBox>
            </div>
        </div>
        <div className="px-2 pb-3 ml-1 inline-flex flex-col justify-between items-center">
            {resultTextBoxes.map((props, index) => 
            <TextBox key={`${props.label}-${index}`} {...props}></TextBox>)}
        </div>
    </div>
    )
}

export default CalculatorBox;