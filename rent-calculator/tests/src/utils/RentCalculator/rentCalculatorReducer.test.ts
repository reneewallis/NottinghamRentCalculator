import {
    BenefitType,
    CalculatorAction,
    CalculatorActions,
    CalculatorState,
    InstallmentFrequency,
    RentFrequency,
} from "@/src/types/RentCalculator";
import { calculateRent, calculateShortfall } from "@/src/utils/helperFunctions";
import {
    initCalculatorState,
    rentCalculatorReducer,
} from "@/src/utils/RentCalculator/rentCalculatorReducer";
import { expect, describe, test } from "@jest/globals";
import dayjs from "dayjs";

describe("rent calculator reducer tests, each test also checks for correct reducer pattern", () => {
    const initDate = dayjs("2026-05-26");
    const initialState: CalculatorState = {
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
        minStartDate: initDate,
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
        minForecastDate: initDate,
        defaultAmount: "",
        defaultAmountIsValid: true,
        forecastPaid: "",
        balanceRemaining: "",
    };

    test("initCalculatorState returns correctly", () => {
        expect(initCalculatorState(initDate)).toEqual(initialState);
    });

    describe("rent tests", () => {
        test.each([
            RentFrequency.FOUR_WEEKLY,
            RentFrequency.MONTHLY,
            RentFrequency.WEEKLY,
        ])(
            "changing rent frequency should have no side effects, frequency %s",
            (frequency) => {
                const state = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: frequency,
                });

                expect(state).not.toBe(initialState);
            },
        );

        test("calculate rent should have no side effects", () => {
            const state = rentCalculatorReducer(initialState, {
                type: CalculatorActions.CALCULATE_RENT,
                amount: "200.00",
            });
            expect(state).not.toBe(initialState);
        });

        test.each([
            RentFrequency.FOUR_WEEKLY,
            RentFrequency.MONTHLY,
            RentFrequency.WEEKLY,
        ])(
            "Select frequency %s and then rent, should have no validity flags",
            (frequency) => {
                let action: CalculatorAction = {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: frequency,
                };
                const expected = initCalculatorState(initDate);
                expected.rentFrequency = frequency;

                let state = rentCalculatorReducer(initialState, action);

                expect(state).toEqual(expected);

                const rentAmount = "200.56";
                const rentState = calculateRent(frequency, rentAmount);

                expected.rentAmount = rentAmount;
                expected.weeklyRent = rentState.weeklyRent;
                expected.monthlyRent = rentState.monthlyRent;
                expected.fourWeeklyRent = rentState.fourWeeklyRent;

                action = {
                    type: CalculatorActions.CALCULATE_RENT,
                    amount: rentAmount,
                };

                state = rentCalculatorReducer(state, action);

                expect(state).toEqual(expected);
            },
        );

        test.each([
            RentFrequency.FOUR_WEEKLY,
            RentFrequency.MONTHLY,
            RentFrequency.WEEKLY,
        ])(
            "rent amount given before rent frequency, should have validility flags until rent frequency is given, frequency %s",
            (frequency) => {
                const expected = initCalculatorState(initDate);
                const rentAmount = "359.00";

                expected.rentAmount = rentAmount;
                expected.rentFrequencyIsValid = false;

                let state = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CALCULATE_RENT,
                    amount: rentAmount,
                });

                expect(state).toEqual(expected);

                const rentState = calculateRent(frequency, rentAmount);

                expected.rentFrequencyIsValid = true;
                expected.weeklyRent = rentState.weeklyRent;
                expected.fourWeeklyRent = rentState.fourWeeklyRent;
                expected.monthlyRent = rentState.monthlyRent;
                expected.rentFrequency = frequency;

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: frequency,
                });

                expect(state).toEqual(expected);
            },
        );
        test.each(["a", "2a", "2.", "2.0", "2.000", "2.a", "2.ab", "2.."])(
            "rent amount %s is invalid",
            (rentAmount) => {
                const expected = initCalculatorState(initDate);
                const action: CalculatorAction = {
                    type: CalculatorActions.CALCULATE_RENT,
                    amount: rentAmount,
                };

                expected.rentAmount = rentAmount;
                expected.rentAmountIsValid = false;
                expected.rentFrequencyIsValid = false;

                expect(rentCalculatorReducer(initialState, action)).toEqual(
                    expected,
                );

                const weeklyState = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: RentFrequency.WEEKLY,
                });
                const fourWeeklyState = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: RentFrequency.FOUR_WEEKLY,
                });
                const monthlyState = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: RentFrequency.MONTHLY,
                });

                expected.rentFrequencyIsValid = true;
                expected.rentFrequency = RentFrequency.WEEKLY;

                expect(rentCalculatorReducer(weeklyState, action)).toEqual(
                    expected,
                );

                expected.rentFrequency = RentFrequency.FOUR_WEEKLY;
                expect(rentCalculatorReducer(fourWeeklyState, action)).toEqual(
                    expected,
                );

                expected.rentFrequency = RentFrequency.MONTHLY;
                expect(rentCalculatorReducer(monthlyState, action)).toEqual(
                    expected,
                );
            },
        );

        test("rent frequency is valid when rent amount returns to empty", () => {
            const expected = initCalculatorState(initDate);
            const rentAmount = "450.76";
            const action: (amount: string) => CalculatorAction = (
                amount: string,
            ) => {
                return {
                    type: CalculatorActions.CALCULATE_RENT,
                    amount: amount,
                };
            };

            expected.rentAmount = rentAmount;
            expected.rentFrequencyIsValid = false;

            const state = rentCalculatorReducer(
                initialState,
                action(rentAmount),
            );

            expect(state).toEqual(expected);

            expected.rentFrequencyIsValid = true;
            expected.rentAmount = "";

            expect(rentCalculatorReducer(state, action(""))).toEqual(expected);
        });
    });

    describe("shortfall tests", () => {
        test.each([BenefitType.HOUSING_BENEFIT, BenefitType.UNIVERSAL_CREDIT])(
            "changing Benefit Type should have no side effects, benefit type is %s",
            (benefitType) => {
                const state = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                    newBenefitType: benefitType,
                });
                expect(state).not.toBe(initialState);
            },
        );
        test("calculating shortfall should have no side effects", () => {
            const state = rentCalculatorReducer(initialState, {
                type: CalculatorActions.CALCULATE_SHORTFALL,
                amount: "200",
            });
            expect(state).not.toBe(initialState);
        });
        test.each([BenefitType.HOUSING_BENEFIT, BenefitType.UNIVERSAL_CREDIT])(
            "changing rent frequency, calculating rent, changing Benefit Type and then calculating shortfall shouldnt have validilty flags",
            (benefitType) => {
                const benefitAmount = "474";
                const rentAmount = "400";

                const rentFrequency = RentFrequency.MONTHLY;
                const expected = initCalculatorState(initDate);

                const rentState = calculateRent(rentFrequency, rentAmount);

                expected.rentAmount = rentAmount;
                expected.rentFrequency = rentFrequency;
                expected.fourWeeklyRent = rentState.fourWeeklyRent;
                expected.monthlyRent = rentState.monthlyRent;
                expected.weeklyRent = rentState.weeklyRent;

                let state = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: rentFrequency,
                });

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CALCULATE_RENT,
                    amount: rentAmount,
                });

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                    newBenefitType: benefitType,
                });

                expected.benefitType = benefitType;

                expect(state).toEqual(expected);

                expected.benefitAmount = benefitAmount;

                const shortFallState = calculateShortfall(
                    benefitType,
                    benefitAmount,
                    expected.weeklyRent,
                    expected.fourWeeklyRent,
                    expected.monthlyRent,
                );

                expected.weeklyShortfall = shortFallState.weeklyShortfall;
                expected.fourWeeklyShortfall =
                    shortFallState.fourWeeklyShortfall;
                expected.monthlyShortfall = shortFallState.monthlyShortfall;

                expect(
                    rentCalculatorReducer(state, {
                        type: CalculatorActions.CALCULATE_SHORTFALL,
                        amount: benefitAmount,
                    }),
                ).toEqual(expected);
            },
        );

        test.each([BenefitType.HOUSING_BENEFIT, BenefitType.UNIVERSAL_CREDIT])(
            "changing rent frequency, calculating rent, calculating shortfall and then changing benefit type, validility flag test",
            (benefitType) => {
                const benefitAmount = "564.75";
                const rentAmount = "200";

                const rentFrequency = RentFrequency.MONTHLY;
                const expected = initCalculatorState(initDate);

                const rentState = calculateRent(rentFrequency, rentAmount);

                expected.rentAmount = rentAmount;
                expected.rentFrequency = rentFrequency;
                expected.fourWeeklyRent = rentState.fourWeeklyRent;
                expected.monthlyRent = rentState.monthlyRent;
                expected.weeklyRent = rentState.weeklyRent;

                let state = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                    newRentFrequency: rentFrequency,
                });

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CALCULATE_RENT,
                    amount: rentAmount,
                });

                expected.benefitAmount = benefitAmount;
                expected.benefitTypeIsValid = false;

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CALCULATE_SHORTFALL,
                    amount: benefitAmount,
                });

                expect(state).toEqual(expected);

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                    newBenefitType: benefitType,
                });

                const shortFallState = calculateShortfall(
                    benefitType,
                    benefitAmount,
                    expected.weeklyRent,
                    expected.fourWeeklyRent,
                    expected.monthlyRent,
                );

                expected.benefitType = benefitType;
                expected.weeklyShortfall = shortFallState.weeklyShortfall;
                expected.fourWeeklyShortfall =
                    shortFallState.fourWeeklyShortfall;
                expected.monthlyShortfall = shortFallState.monthlyShortfall;
                expected.benefitTypeIsValid = true;

                expect(state).toEqual(expected);
            },
        );
        test.each([BenefitType.HOUSING_BENEFIT, BenefitType.UNIVERSAL_CREDIT])(
            "changing benefit type, calculating shortfall, changing rent frequency and then calculating rent validility flag test",
            (benefitType) => {
                const benefitAmount = "564.75";
                const rentAmount = "200";
                const rentFrequencyArray = [
                    RentFrequency.MONTHLY,
                    RentFrequency.FOUR_WEEKLY,
                    RentFrequency.WEEKLY,
                ];

                const expected = initCalculatorState(initDate);

                expected.benefitType = benefitType;
                expected.rentAmountIsValid = false;
                expected.rentFrequencyIsValid = false;

                let state = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                    newBenefitType: benefitType,
                });

                expect(state).toEqual(expected);

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CALCULATE_SHORTFALL,
                    amount: benefitAmount,
                });

                expected.benefitAmount = benefitAmount;

                expect(state).toEqual(expected);

                expected.rentFrequencyIsValid = true;

                for (const rentFrequency of rentFrequencyArray) {
                    expected.rentAmountIsValid = false;
                    expected.rentAmount = "";
                    expected.fourWeeklyRent = "";
                    expected.monthlyRent = "";
                    expected.weeklyRent = "";
                    expected.weeklyShortfall = "";
                    expected.fourWeeklyShortfall = "";
                    expected.monthlyShortfall = "";

                    expected.rentFrequency = rentFrequency;
                    let loopState = rentCalculatorReducer(state, {
                        type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                        newRentFrequency: rentFrequency,
                    });

                    expect(loopState).toEqual(expected);

                    const rentState = calculateRent(rentFrequency, rentAmount);

                    expected.rentAmount = rentAmount;
                    expected.fourWeeklyRent = rentState.fourWeeklyRent;
                    expected.monthlyRent = rentState.monthlyRent;
                    expected.weeklyRent = rentState.weeklyRent;
                    expected.rentAmountIsValid = true;

                    const shortFallState = calculateShortfall(
                        benefitType,
                        benefitAmount,
                        expected.weeklyRent,
                        expected.fourWeeklyRent,
                        expected.monthlyRent,
                    );

                    expected.weeklyShortfall = shortFallState.weeklyShortfall;
                    expected.fourWeeklyShortfall =
                        shortFallState.fourWeeklyShortfall;
                    expected.monthlyShortfall = shortFallState.monthlyShortfall;

                    loopState = rentCalculatorReducer(loopState, {
                        type: CalculatorActions.CALCULATE_RENT,
                        amount: rentAmount,
                    });

                    expect(loopState).toEqual(expected);
                }
            },
        );
        test.each([BenefitType.HOUSING_BENEFIT, BenefitType.UNIVERSAL_CREDIT])(
            "changing benefit type, calculating shortfall, calculating rent and then changing rentFreq validility flag test",
            (benefitType) => {
                const benefitAmount = "564.75";
                const rentAmount = "200";
                const rentFrequencyArray = [
                    RentFrequency.MONTHLY,
                    RentFrequency.FOUR_WEEKLY,
                    RentFrequency.WEEKLY,
                ];

                const expected = initCalculatorState(initDate);

                expected.benefitType = benefitType;
                expected.rentAmountIsValid = false;
                expected.rentFrequencyIsValid = false;

                let state = rentCalculatorReducer(initialState, {
                    type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                    newBenefitType: benefitType,
                });

                expect(state).toEqual(expected);

                state = rentCalculatorReducer(state, {
                    type: CalculatorActions.CALCULATE_SHORTFALL,
                    amount: benefitAmount,
                });

                expected.benefitAmount = benefitAmount;

                expect(state).toEqual(expected);

                expected.rentAmountIsValid = true;
                expected.rentAmount = rentAmount;

                for (const rentFrequency of rentFrequencyArray) {
                    expected.rentFrequencyIsValid = false;
                    expected.rentFrequency = RentFrequency.UNSELECTED;
                    expected.fourWeeklyRent = "";
                    expected.monthlyRent = "";
                    expected.weeklyRent = "";
                    expected.weeklyShortfall = "";
                    expected.fourWeeklyShortfall = "";
                    expected.monthlyShortfall = "";

                    let loopState = rentCalculatorReducer(state, {
                        type: CalculatorActions.CALCULATE_RENT,
                        amount: rentAmount,
                    });

                    expect(loopState).toEqual(expected);

                    const rentState = calculateRent(rentFrequency, rentAmount);

                    expected.rentFrequency = rentFrequency;
                    expected.fourWeeklyRent = rentState.fourWeeklyRent;
                    expected.monthlyRent = rentState.monthlyRent;
                    expected.weeklyRent = rentState.weeklyRent;
                    expected.rentFrequencyIsValid = true;

                    const shortFallState = calculateShortfall(
                        benefitType,
                        benefitAmount,
                        expected.weeklyRent,
                        expected.fourWeeklyRent,
                        expected.monthlyRent,
                    );

                    expected.weeklyShortfall = shortFallState.weeklyShortfall;
                    expected.fourWeeklyShortfall =
                        shortFallState.fourWeeklyShortfall;
                    expected.monthlyShortfall = shortFallState.monthlyShortfall;

                    loopState = rentCalculatorReducer(loopState, {
                        type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                        newRentFrequency: rentFrequency,
                    });

                    expect(loopState).toEqual(expected);
                }
            },
        );
    });
});
