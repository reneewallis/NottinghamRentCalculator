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
    amount: string;
    weeklyAmount: string;
    fourWeeklyAmount: string;
    monthlyAmount: string;
}

type RentActionCalculate = {
    type: RentActions.CALCULATE;
    amount: string;
}

type RentActionChangeFrequency = {
    type: RentActions.CHANGE_FREQUENCY;
    newFrequency: RentFrequency;
}

export type RentAction = RentActionCalculate | RentActionChangeFrequency;