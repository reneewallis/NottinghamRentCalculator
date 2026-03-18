import React from "react";
import { CalculatorBoxProps } from "@/src/Types/PanelElements";
import CustomDropdownBox from "../Dropdown/DropdownBox";
import TextBox from "../InputFields/TextBox";

function CalculatorBox({dropDownProps, inputTextBoxProps, resultTextBoxes, flipResultTextBoxes = false}: CalculatorBoxProps){
    return(
    <div className="flex flex-row">
        {flipResultTextBoxes && 
        <div className="px-2 pb-3 mr-2 inline-flex flex-col justify-between">
            {resultTextBoxes.map((props, index) => 
            <TextBox key={`${props.label}-${index}`} {...props} alignment="right" width={12}></TextBox>)}
        </div>
        }
        <div className="inline-flex flex-col justify-between gap-20.5 bg-gray-800 rounded-xl shadow-lg border-4 border-gray-300 pt-12 pb-13 pl-9 pr-18">
            <CustomDropdownBox {...dropDownProps}></CustomDropdownBox>
            <TextBox {...inputTextBoxProps} width={13}></TextBox>
        </div>
        {!flipResultTextBoxes && 
        <div className="px-2 pb-3 ml-2 inline-flex flex-col justify-between">
            {resultTextBoxes.map((props, index) => 
            <TextBox key={`${props.label}-${index}`} {...props} width={12}></TextBox>)}
        </div>
        }
    </div>
    )
}

export default CalculatorBox;