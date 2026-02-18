import { DropdownBoxProps } from "./Dropdown";
import { InputTextBoxProps, ReadOnlyTextBoxProps} from "./TextBox";

export type CalculatorBoxProps = {
    dropDownProps: DropdownBoxProps;
    inputTextBoxProps: InputTextBoxProps; 
    resultTextBoxes: ReadOnlyTextBoxProps[];
}