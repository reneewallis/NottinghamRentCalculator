import {
    BenefitType,
    CalculatorAction,
    CalculatorActions,
    CalculatorState,
    InstallmentFrequency,
    RentFrequency,
} from "@/src/types/RentCalculator";
import { calculateRent } from "@/src/utils/helperFunctions";
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
            "rent amount given before rent frequency, should have validility flags, frequency %s",
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
});
