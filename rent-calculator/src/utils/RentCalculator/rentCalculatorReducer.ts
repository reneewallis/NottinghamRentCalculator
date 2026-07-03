import { Dayjs } from "dayjs";

import {
    BalanceState,
    BenefitType,
    CalculatorAction,
    CalculatorActions,
    CalculatorState,
    ForecastState,
    InstallmentFrequency,
    RentFrequency,
    RentState,
    ShortfallState,
} from "@/src/types/RentCalculator";

import {
    calculateForecast,
    calculateForecastDate,
    calculateRent,
    calculateShortfall,
    calculateStartingBalance,
    isValidNumberEntry,
} from "../helperFunctions";

export function rentCalculatorReducer(
    state: CalculatorState,
    action: CalculatorAction,
): CalculatorState {
    let rent: RentState = {
        rentFrequency: state.rentFrequency,
        rentAmount: state.rentAmount,
        rentFrequencyIsValid: state.rentFrequencyIsValid,
        rentAmountIsValid: state.rentAmountIsValid,
        weeklyRent: state.weeklyRent,
        fourWeeklyRent: state.fourWeeklyRent,
        monthlyRent: state.monthlyRent,
    };

    let shortfall: ShortfallState = {
        benefitType: state.benefitType,
        benefitAmount: state.benefitAmount,
        benefitTypeIsValid: state.benefitTypeIsValid,
        benefitAmountIsValid: state.benefitAmountIsValid,
        weeklyShortfall: state.weeklyShortfall,
        fourWeeklyShortfall: state.fourWeeklyShortfall,
        monthlyShortfall: state.monthlyShortfall,
    };

    const balance: BalanceState = {
        startDate: state.startDate,
        minStartDate: state.minStartDate,
        startDateIsValid: state.startDateIsValid,
        daysUntilStartDate: state.daysUntilStartDate,
        weeksUntilStartDate: state.weeksUntilStartDate,
        currentBalance: state.currentBalance,
        currentBalanceIsValid: state.currentBalanceIsValid,
        startingBalance: state.startingBalance,
    };

    let forecast: ForecastState = {
        paymentFrequency: state.paymentFrequency,
        paymentFrequencyIsValid: state.paymentFrequencyIsValid,
        totalInstallments: state.totalInstallments,
        installmentNumber: state.installmentNumber,
        forecastDate: state.forecastDate,
        forecastDateIsValid: state.forecastDateIsValid,
        minForecastDate: state.minForecastDate,
        defaultAmount: state.defaultAmount,
        defaultAmountIsValid: state.defaultAmountIsValid,
        forecastPaid: state.forecastPaid,
        balanceRemaining: state.balanceRemaining,
    };

    switch (action.type) {
        case CalculatorActions.CHANGE_RENT_FREQUENCY: {
            rent.rentFrequency = action.newRentFrequency;
            rent.rentFrequencyIsValid = true;

            if (rent.rentAmount !== "") {
                rent = calculateRent(rent.rentFrequency, rent.rentAmount);

                if (balance.startDateIsValid) {
                    balance.startingBalance = calculateStartingBalance(
                        balance.weeksUntilStartDate,
                        balance.currentBalance,
                        rent.weeklyRent,
                    );

                    forecast = calculateForecast(
                        balance.startingBalance,
                        balance.startDate,
                        balance.startDateIsValid,
                        forecast,
                    );
                }

                if (shortfall.benefitAmount !== "") {
                    shortfall = calculateShortfall(
                        shortfall.benefitType,
                        shortfall.benefitAmount,
                        rent.weeklyRent,
                        rent.fourWeeklyRent,
                        rent.monthlyRent,
                    );
                }
            }

            break;
        }

        case CalculatorActions.CALCULATE_RENT: {
            rent.rentAmount = action.amount;
            rent = calculateRent(rent.rentFrequency, rent.rentAmount);

            if (shortfall.benefitAmount !== "") {
                shortfall = calculateShortfall(
                    shortfall.benefitType,
                    shortfall.benefitAmount,
                    rent.weeklyRent,
                    rent.fourWeeklyRent,
                    rent.monthlyRent,
                );
            }

            if (balance.startDate && balance.startDateIsValid) {
                balance.startingBalance = calculateStartingBalance(
                    balance.weeksUntilStartDate,
                    balance.currentBalance,
                    rent.weeklyRent,
                );

                forecast = calculateForecast(
                    balance.startingBalance,
                    balance.startDate,
                    balance.startDateIsValid,
                    forecast,
                );
            }

            if (
                rent.rentAmount === "" &&
                !(
                    shortfall.benefitAmount === "" &&
                    shortfall.benefitType === BenefitType.UNSELECTED &&
                    balance.startDate === null &&
                    balance.currentBalance === "" &&
                    forecast.defaultAmount === "" &&
                    forecast.forecastDate === null &&
                    forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
                )
            ) {
                if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                    rent.rentFrequencyIsValid = false;
                }
                rent.rentAmountIsValid = false;
            }

            break;
        }

        case CalculatorActions.CHANGE_BENEFIT_TYPE: {
            shortfall.benefitType = action.newBenefitType;
            shortfall.benefitTypeIsValid = true;

            if (shortfall.benefitAmount !== "") {
                shortfall = calculateShortfall(
                    shortfall.benefitType,
                    shortfall.benefitAmount,
                    rent.weeklyRent,
                    rent.fourWeeklyRent,
                    rent.monthlyRent,
                );
            }

            if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                rent.rentFrequencyIsValid = false;
            }

            if (rent.rentAmount === "") {
                rent.rentAmountIsValid = false;
            }

            break;
        }

        case CalculatorActions.CALCULATE_SHORTFALL: {
            shortfall.benefitAmount = action.amount;

            shortfall = calculateShortfall(
                shortfall.benefitType,
                shortfall.benefitAmount,
                rent.weeklyRent,
                rent.fourWeeklyRent,
                rent.monthlyRent,
            );

            if (shortfall.benefitAmount !== "") {
                if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                    rent.rentFrequencyIsValid = false;
                }

                if (rent.rentAmount === "") {
                    rent.rentAmountIsValid = false;
                }
            } else {
                if (
                    shortfall.benefitType === BenefitType.UNSELECTED &&
                    rent.rentAmount === "" &&
                    balance.currentBalance === "" &&
                    balance.startDate === null &&
                    forecast.forecastDate === null &&
                    forecast.defaultAmount === "" &&
                    forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
                ) {
                    rent.rentAmountIsValid = true;
                    if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                        rent.rentFrequencyIsValid = true;
                    }
                }
            }

            break;
        }

        case CalculatorActions.SET_START_DATE: {
            balance.startDate = action.date;
            break;
        }

        case CalculatorActions.ON_START_DATE_ERROR: {
            if (action.error) {
                balance.startDateIsValid = false;
                balance.daysUntilStartDate = -1;
                balance.weeksUntilStartDate = -1;
                balance.startingBalance = "";
                forecast.balanceRemaining = "";
                forecast.installmentNumber = 0;
                forecast.forecastPaid = "";
                forecast.totalInstallments = -1;
                console.log(
                    `start date error: ${action.error}\nvalue: ${action.value?.format("DD/MM/YYYY")}`,
                );
            }
            break;
        }

        case CalculatorActions.CHANGE_START_DATE: {
            let calcForecastInstallment = true;
            if (balance.startDate !== null) {
                balance.startDateIsValid = true;
                balance.daysUntilStartDate = balance.startDate
                    .startOf("day")
                    .diff(balance.minStartDate.startOf("day"), "days");
                balance.weeksUntilStartDate = Math.ceil(balance.daysUntilStartDate / 7);
                balance.startingBalance = calculateStartingBalance(
                    balance.weeksUntilStartDate,
                    balance.currentBalance,
                    rent.weeklyRent,
                );

                if (
                    forecast.paymentFrequency !== InstallmentFrequency.UNSELECTED &&
                    forecast.forecastDate === null
                ) {
                    if (balance.startDate && balance.startDateIsValid) {
                        const forecastDate = calculateForecastDate(
                            balance.startDate,
                            forecast.minForecastDate,
                            forecast.paymentFrequency,
                            forecast.installmentNumber,
                        );
                        if (forecastDate) {
                            forecast.forecastDate = forecastDate;
                            calcForecastInstallment = false;
                        }
                    }
                }

                if (balance.weeksUntilStartDate !== 0) {
                    if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                        rent.rentFrequencyIsValid = false;
                    }

                    if (rent.rentAmount === "") {
                        rent.rentAmountIsValid = false;
                    }
                } else {
                    if (
                        rent.rentAmount === "" &&
                        shortfall.benefitAmount === "" &&
                        shortfall.benefitType === BenefitType.UNSELECTED
                    ) {
                        rent.rentAmountIsValid = true;
                        if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                            rent.rentFrequencyIsValid = true;
                        }
                    }
                }
            } else {
                balance.daysUntilStartDate = -1;
                balance.weeksUntilStartDate = -1;
                balance.startingBalance = "";

                if (
                    balance.currentBalance === "" &&
                    forecast.defaultAmount === "" &&
                    forecast.forecastDate === null &&
                    forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
                ) {
                    balance.startDateIsValid = true;
                    if (
                        rent.rentAmount === "" &&
                        balance.currentBalance === "" &&
                        balance.startDate === null &&
                        shortfall.benefitType === BenefitType.UNSELECTED &&
                        shortfall.benefitAmount === "" &&
                        forecast.defaultAmount === "" &&
                        forecast.forecastDate === null &&
                        forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
                    ) {
                        rent.rentAmountIsValid = true;
                        if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                            rent.rentFrequencyIsValid = true;
                        }
                    }
                } else {
                    balance.startDateIsValid = false;
                }
            }

            forecast = calculateForecast(
                balance.startingBalance,
                balance.startDate,
                balance.startDateIsValid,
                forecast,
                calcForecastInstallment,
            );

            break;
        }

        case CalculatorActions.CALCULATE_STARTING_BALANCE: {
            balance.currentBalance = action.newCurrentBalance;

            balance.startingBalance = calculateStartingBalance(
                balance.weeksUntilStartDate,
                balance.currentBalance,
                rent.weeklyRent,
            );
            forecast = calculateForecast(
                balance.startingBalance,
                balance.startDate,
                balance.startDateIsValid,
                forecast,
            );

            if (balance.currentBalance !== "") {
                balance.currentBalanceIsValid = isValidNumberEntry(balance.currentBalance);

                if (balance.weeksUntilStartDate !== 0) {
                    if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                        rent.rentFrequencyIsValid = false;
                    }

                    if (rent.rentAmount === "") {
                        rent.rentAmountIsValid = false;
                    }
                } else {
                    if (
                        rent.rentAmount === "" &&
                        shortfall.benefitAmount === "" &&
                        shortfall.benefitType === BenefitType.UNSELECTED
                    ) {
                        rent.rentAmountIsValid = true;
                        if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                            rent.rentFrequencyIsValid = true;
                        }
                    }
                }

                if (balance.startDate === null) {
                    balance.startDateIsValid = false;
                }
            } else {
                if (
                    forecast.forecastDate === null &&
                    forecast.defaultAmount === "" &&
                    forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
                ) {
                    balance.currentBalanceIsValid = true;
                    if (balance.startDate === null) {
                        balance.startDateIsValid = true;
                        if (
                            rent.rentAmount === "" &&
                            shortfall.benefitType === BenefitType.UNSELECTED &&
                            shortfall.benefitAmount === ""
                        ) {
                            rent.rentAmountIsValid = true;
                            if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                                rent.rentFrequencyIsValid = true;
                            }
                        }
                    }
                } else {
                    balance.currentBalanceIsValid = false;
                }
            }

            break;
        }

        case CalculatorActions.CHANGE_PAYMENT_FREQUENCY: {
            forecast.paymentFrequency = action.frequency;
            forecast.paymentFrequencyIsValid = true;
            let calcForecastInstallment = true;
            if (forecast.forecastDate === null && balance.startDate && balance.startDateIsValid) {
                const forecastDate = calculateForecastDate(
                    balance.startDate,
                    forecast.minForecastDate,
                    forecast.paymentFrequency,
                    forecast.installmentNumber,
                );
                if (forecastDate) {
                    forecast.forecastDate = forecastDate;
                    calcForecastInstallment = false;
                }
            }
            forecast = calculateForecast(
                balance.startingBalance,
                balance.startDate,
                balance.startDateIsValid,
                forecast,
                calcForecastInstallment,
            );

            if (forecast.defaultAmount === "") {
                forecast.defaultAmountIsValid = false;
            }

            if (balance.currentBalance === "") {
                balance.currentBalanceIsValid = false;
            }

            if (balance.startDate === null) {
                balance.startDateIsValid = false;
            }

            if (balance.weeksUntilStartDate !== 0) {
                if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                    rent.rentFrequencyIsValid = false;
                }

                if (rent.rentAmount === "") {
                    rent.rentAmountIsValid = false;
                }
            }

            break;
        }

        case CalculatorActions.SET_FORECAST_DATE: {
            forecast.forecastDate = action.date;
            break;
        }

        case CalculatorActions.ON_FORECAST_DATE_ERROR: {
            if (action.error) {
                forecast.forecastDateIsValid = false;
                console.log(
                    `forcast date error: ${action.error}\nvalue: ${action.value?.format("DD/MM/YYYY")}`,
                );
            }
            break;
        }

        case CalculatorActions.CHANGE_FORCAST_DATE: {
            forecast.forecastDateIsValid = true;
            forecast = calculateForecast(
                balance.startingBalance,
                balance.startDate,
                balance.startDateIsValid,
                forecast,
            );

            if (forecast.forecastDate !== null) {
                if (balance.startDate === null) {
                    balance.startDateIsValid = false;
                }

                if (balance.currentBalance === "") {
                    balance.currentBalanceIsValid = false;
                }

                if (balance.weeksUntilStartDate !== 0) {
                    if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                        rent.rentFrequencyIsValid = false;
                    }

                    if (rent.rentAmount === "") {
                        rent.rentAmountIsValid = false;
                    }
                }

                if (forecast.paymentFrequency === InstallmentFrequency.UNSELECTED) {
                    forecast.paymentFrequencyIsValid = false;
                }

                if (forecast.defaultAmount === "") {
                    forecast.defaultAmountIsValid = false;
                }
            } else {
                if (forecast.paymentFrequency === InstallmentFrequency.UNSELECTED) {
                    forecast.paymentFrequencyIsValid = true;
                    if (forecast.defaultAmount === "") {
                        forecast.defaultAmountIsValid = true;
                        if (balance.currentBalance === "") {
                            balance.currentBalanceIsValid = true;
                            if (balance.startDate === null) {
                                balance.startDateIsValid = true;
                                if (
                                    rent.rentAmount === "" &&
                                    shortfall.benefitType === BenefitType.UNSELECTED &&
                                    shortfall.benefitAmount === ""
                                ) {
                                    rent.rentAmountIsValid = true;
                                    if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                                        rent.rentFrequencyIsValid = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            break;
        }

        case CalculatorActions.CHANGE_DEFAULT_AMOUNT: {
            forecast.defaultAmount = action.defaultAmount;
            forecast = calculateForecast(
                balance.startingBalance,
                balance.startDate,
                balance.startDateIsValid,
                forecast,
            );

            if (forecast.defaultAmount !== "") {
                forecast.defaultAmountIsValid = isValidNumberEntry(forecast.defaultAmount);
                if (balance.weeksUntilStartDate !== 0) {
                    if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                        rent.rentFrequencyIsValid = false;
                    }

                    if (rent.rentAmount === "") {
                        rent.rentAmountIsValid = false;
                    }
                }

                if (balance.startDate === null) {
                    balance.startDateIsValid = false;
                }

                if (balance.currentBalance === "") {
                    balance.currentBalanceIsValid = false;
                }
            } else {
                if (
                    forecast.forecastDate === null &&
                    forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
                ) {
                    forecast.defaultAmountIsValid = true;
                    if (balance.currentBalance === "") {
                        balance.currentBalanceIsValid = true;
                        if (balance.startDate === null) {
                            balance.startDateIsValid = true;
                            if (
                                rent.rentAmount === "" &&
                                shortfall.benefitType === BenefitType.UNSELECTED &&
                                shortfall.benefitAmount === ""
                            ) {
                                rent.rentAmountIsValid = true;
                                if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                                    rent.rentFrequencyIsValid = true;
                                }
                            }
                        }
                    }
                } else {
                    forecast.defaultAmountIsValid = false;
                }
            }

            break;
        }

        case CalculatorActions.CHANGE_INSTALLMENT_NUMBER: {
            forecast.installmentNumber = action.number;

            if (forecast.paymentFrequency === InstallmentFrequency.UNSELECTED) {
                forecast.paymentFrequencyIsValid = false;
            }

            if (balance.startDate && balance.startDateIsValid) {
                const forecastDate = calculateForecastDate(
                    balance.startDate,
                    forecast.minForecastDate,
                    forecast.paymentFrequency,
                    forecast.installmentNumber,
                );
                if (forecastDate) {
                    forecast.forecastDate = forecastDate;
                }
            }

            forecast = calculateForecast(
                balance.startingBalance,
                balance.startDate,
                balance.startDateIsValid,
                forecast,
                false,
            );

            break;
        }
    }

    return {
        ...rent,
        ...shortfall,
        ...balance,
        ...forecast,
    };
}

export function initCalculatorState(today: Dayjs): CalculatorState {
    return {
        rentFrequency: RentFrequency.UNSELECTED,
        rentAmount: "",
        rentFrequencyIsValid: true,
        rentAmountIsValid: true,
        weeklyRent: "",
        fourWeeklyRent: "",
        monthlyRent: "",
        benefitType: BenefitType.UNSELECTED,
        benefitAmount: "",
        benefitTypeIsValid: true,
        benefitAmountIsValid: true,
        weeklyShortfall: "",
        fourWeeklyShortfall: "",
        monthlyShortfall: "",
        startDate: null,
        minStartDate: today,
        startDateIsValid: true,
        daysUntilStartDate: -1,
        weeksUntilStartDate: -1,
        currentBalance: "",
        currentBalanceIsValid: true,
        startingBalance: "",
        paymentFrequency: InstallmentFrequency.UNSELECTED,
        paymentFrequencyIsValid: true,
        totalInstallments: -1,
        installmentNumber: 0,
        forecastDate: null,
        forecastDateIsValid: true,
        minForecastDate: today,
        defaultAmount: "",
        defaultAmountIsValid: true,
        forecastPaid: "",
        balanceRemaining: "",
    };
}
