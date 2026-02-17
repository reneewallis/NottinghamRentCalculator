export type DropdownItem = {
    label: string;
    onClick: () => void;
}

export type DropdownProps = {
    items: DropdownItem[];
}

export type DropdownBoxProps = {
    label: string;
    boxText: string;
    items: DropdownItem[];
}

export enum RentFrequency {
    UNSELECTED = ("Rent Frequency"),
    WEEKLY = ("Weekly"),
    FOUR_WEEKLY = ("4-Weekly"),
    MONTHLY = ("Monthly"),
}

export enum BenefitType{
    UNSELECTED,
    UNIVERSAL_CREDIT,
    HOUSING_BENEFIT
}

export enum RentActions{
    CALCULATE,
    CHANGE_FREQUENCY
}

export type RentState = {
    frequency: RentFrequency;
    amount: number | null;
}

type RentActionCalculate = {
    type: RentActions.CALCULATE;
    amount: number;
}

type RentActionChangeFrequency = {
    type: RentActions.CHANGE_FREQUENCY;
    newFrequency: RentFrequency;
}

export type RentAction = RentActionCalculate | RentActionChangeFrequency;