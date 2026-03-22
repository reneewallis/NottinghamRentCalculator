import { Dayjs } from "dayjs";

export enum RentFrequency {
    UNSELECTED = ("Rent Frequency"),
    WEEKLY = ("Weekly"),
    FOUR_WEEKLY = ("4-Weekly"),
    MONTHLY = ("Monthly")
}

export enum BenefitType{
    UNSELECTED = ("Benefit Type"),
    UNIVERSAL_CREDIT = ("Universal Credit"),
    HOUSING_BENEFIT = ("Housing Benefit")
}

export enum InstallmentFrequency{
    UNSELECTED = ("Installment"),
    MONTHLY = ("Month"),
    WEEKLY = ("Week")
}

export type RentState = {
    rentFrequency: RentFrequency;
    rentAmount: string;
    rentFrequencyIsValid: boolean;
    rentAmountIsValid: boolean;
    weeklyRent: string;
    fourWeeklyRent: string;
    monthlyRent: string;
}

export type ShortfallState = {
    benefitType: BenefitType;
    benefitAmount: string;
    benefitTypeIsValid: boolean;
    benefitAmountIsValid: boolean;
    weeklyShortfall: string;
    fourWeeklyShortfall: string;
    monthlyShortfall: string
}

export type BalanceState = {
    startDate: Dayjs | null;
    minStartDate: Dayjs;
    startDateIsValid: boolean;
    daysUntilStartDate: number;
    weeksUntilStartDate: number;
    currentBalance: string;
    currentBalanceIsValid: boolean;
    startingBalance: string;
}

export type ForecastState = {
    paymentFrequency: InstallmentFrequency;
    paymentFrequencyIsValid: boolean;
    totalInstallments: number;
    installmentNumber: number;
    forecastDate: Dayjs | null;
    forecastDateIsValid: boolean;
    minForecastDate: Dayjs;
    defaultAmount: string;
    defaultAmountIsValid: boolean;
    forecastPaid: string;
    balanceRemaining: string;
}

export type CalculatorState = RentState & ShortfallState & BalanceState & ForecastState;

export enum CalculatorActions{
    CALCULATE_RENT,
    CHANGE_RENT_FREQUENCY,
    CHANGE_BENEFIT_TYPE,
    CALCULATE_SHORTFALL,
    SET_START_DATE,
    ON_START_DATE_ERROR,
    CHANGE_START_DATE,
    CALCULATE_STARTING_BALANCE,
    CHANGE_PAYMENT_FREQUENCY,
    SET_FORECAST_DATE,
    ON_FORECAST_DATE_ERROR,
    CHANGE_FORCAST_DATE,
    CHANGE_DEFAULT_AMOUNT,
    CHANGE_INSTALLMENT_NUMBER
}


type RentActionCalculate = {
    type: CalculatorActions.CALCULATE_RENT;
    amount: string;
}

type RentActionChangeFrequency = {
    type: CalculatorActions.CHANGE_RENT_FREQUENCY;
    newRentFrequency: RentFrequency;
}

type ShortfallActionChangeBenefitType = {
    type: CalculatorActions.CHANGE_BENEFIT_TYPE;
    newBenefitType: BenefitType;
}

type ShortfallActionCalculate = {
    type: CalculatorActions.CALCULATE_SHORTFALL;
    amount: string;
}
type BalanceActionSetStartDate = {
    type: CalculatorActions.SET_START_DATE;
    date: Dayjs | null;
}

type BalanceActionStartDateError = {
    type: CalculatorActions.ON_START_DATE_ERROR;
    error: string | null;
    value: Dayjs | null;
}

type BalanceActionChangeStartDate = {
    type: CalculatorActions.CHANGE_START_DATE;
}

type BalanceActionCaluclateStartingBalance = {
    type:CalculatorActions.CALCULATE_STARTING_BALANCE;
    newCurrentBalance: string;
}

type ForecastActionChangePaymentFrequency = {
    type: CalculatorActions.CHANGE_PAYMENT_FREQUENCY;
    frequency: InstallmentFrequency;
}

type ForecastActionSetForecastDate = {
    type: CalculatorActions.SET_FORECAST_DATE;
    date: Dayjs | null;
}

type ForecastActionForecastDateError = {
    type: CalculatorActions.ON_FORECAST_DATE_ERROR;
    error: string | null;
    value: Dayjs | null;
}

type ForecastActionChangeForecastDate = {
    type: CalculatorActions.CHANGE_FORCAST_DATE;
}

type ForecastActionCalculateTotalInstallments = {
    type: CalculatorActions.CHANGE_DEFAULT_AMOUNT;
    defaultAmount: string;
}

type ForecastActionChangeInstallmentNumber = {
    type: CalculatorActions.CHANGE_INSTALLMENT_NUMBER;
    number: number;
}

export type CalculatorAction = RentActionCalculate | RentActionChangeFrequency | 
ShortfallActionChangeBenefitType | ShortfallActionCalculate |
 BalanceActionSetStartDate | BalanceActionStartDateError | BalanceActionChangeStartDate | BalanceActionCaluclateStartingBalance | 
 ForecastActionChangePaymentFrequency | ForecastActionSetForecastDate | ForecastActionForecastDateError | ForecastActionChangeForecastDate | ForecastActionCalculateTotalInstallments | ForecastActionChangeInstallmentNumber;