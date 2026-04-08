import { ReactElement } from "react";
import { DropdownBoxProps } from "./Dropdown";
import {
    DateBoxProps,
    InputTextBoxProps,
    ReadOnlyTextBoxProps,
    TextBoxProps,
} from "./InputFields";
import {
    BenefitType,
    InstallmentFrequency,
    RentFrequency,
} from "./RentCalculator";

export type CalculatorBoxDropdownBoxes = {
    rent: DropdownBoxProps<RentFrequency>;
    shortfall: DropdownBoxProps<BenefitType>;
};

export type CalculatorBoxProps = {
    dropDownProps: DropdownBoxProps<string>;
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
type SidePanelElement<TLabel extends string> =
    | ReactElement<TextBoxProps>
    | ReactElement<DropdownBoxProps<TLabel>>;

export type CalculatorPanelProps<TLabel extends string> = {
    circleValue: string;
    circleLabel: string;
    mainPanelBoxes: MainPanelElement[];
    sidePanelBoxes: SidePanelElement<TLabel>[];
    flipPanel?: boolean;
};
