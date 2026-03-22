import { ReactElement } from "react";
import { DropdownBoxProps } from "./Dropdown";
import {
  DateBoxProps,
  InputTextBoxProps,
  ReadOnlyTextBoxProps,
  TextBoxProps,
} from "./InputFields";
import { InstallmentFrequency } from "./RentCalculator";

export type CalculatorBoxProps = {
  dropDownProps: DropdownBoxProps;
  inputTextBoxProps: InputTextBoxProps;
  resultTextBoxes: ReadOnlyTextBoxProps[];
  flipResultTextBoxes?: boolean;
};

export type InstallementScrollerProps = {
  totalInstallments: number;
  installmentNumber: number;
  frequency: InstallmentFrequency;
  onChange?: (installment: number) => void;
};

type MainPanelElement =
  | ReactElement<TextBoxProps>
  | ReactElement<DateBoxProps>
  | ReactElement<InstallementScrollerProps>;
type SidePanelElement =
  | ReactElement<TextBoxProps>
  | ReactElement<DropdownBoxProps>;

export type CalculatorPanelProps = {
  circleValue: string;
  circleLabel: string;
  mainPanelBoxes: MainPanelElement[];
  sidePanelBoxes: SidePanelElement[];
  flipPanel?: boolean;
};
