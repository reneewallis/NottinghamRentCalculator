import { CalculatorBoxProps } from "../../types/PanelElements";
import CustomDropdownBox from "../Dropdown/DropdownBox";
import TextBox from "../InputFields/TextBox";

function CalculatorBox({
    dropDownProps,
    inputTextBoxProps,
    resultTextBoxes,
    flipResultTextBoxes = false,
}: CalculatorBoxProps) {
    return (
        <div className="inline-flex flex-row">
            {flipResultTextBoxes && (
                <div
                    className="
                      mr-2 inline-flex flex-col justify-between px-2 pb-3
                    "
                >
                    {resultTextBoxes.map((props) => (
                        <TextBox
                            key={`${props.label}`}
                            {...props}
                            alignment="right"
                            width={12}
                        ></TextBox>
                    ))}
                </div>
            )}
            <div
                className="
                  inline-flex flex-col justify-between gap-18.5 rounded-xl
                  border-4 border-gray-300 bg-gray-800 py-12 pr-12 pl-9
                  shadow-lg
                  lg:gap-20.5
                "
            >
                <CustomDropdownBox {...dropDownProps}></CustomDropdownBox>
                <TextBox {...inputTextBoxProps} width={13}></TextBox>
            </div>
            {!flipResultTextBoxes && (
                <div
                    className="
                      ml-2 inline-flex flex-col justify-between px-2 pb-3
                    "
                >
                    {resultTextBoxes.map((props) => (
                        <TextBox key={`${props.label}`} {...props} width={12}></TextBox>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CalculatorBox;
