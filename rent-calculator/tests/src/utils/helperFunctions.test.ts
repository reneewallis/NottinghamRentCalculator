import {
    BenefitType,
    ForecastState,
    InstallmentFrequency,
    RentFrequency,
    RentState,
    ShortfallState,
} from "@/src/types/RentCalculator";
import {
    calcPx,
    calculateBalanceRemaining,
    calculateForecast,
    calculateForecastDate,
    calculateForecastPaid,
    calculateInstallment,
    calculateRent,
    calculateShortfall,
    calculateStartingBalance,
    calculateTotalInstallments,
    ceil2DP,
    floor2DP,
    fluidCSSWidthScale,
    getMaxTabs,
    isValidNumberEntry,
    UnsupportedUnitError,
} from "@/src/utils/helperFunctions";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test,
} from "@jest/globals";
import dayjs, { Dayjs } from "dayjs";
import Decimal from "decimal.js";

describe("getMaxTabs test, viewportWidth is in Rem, minimum size is 0", () => {
    test("Minimum viewport size", () => {
        expect(getMaxTabs(0)).toBe(1);
    });

    test("Dev viewport size", () => {
        expect(getMaxTabs(96)).toBe(17);
    });

    test("tablet", () => {
        expect(getMaxTabs(48)).toBe(8);
    });

    test("large screen", () => {
        expect(getMaxTabs(120)).toBe(22);
    });

    test("small screen", () => {
        expect(getMaxTabs(20)).toBe(2);
    });
});

describe("fluidCSSWidthScale and calcPx tests", () => {
    beforeEach(() => {
        jest.spyOn(window, "getComputedStyle").mockReturnValue({
            fontSize: "16px",
        } as CSSStyleDeclaration);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("calc px tests", () => {
        test("only unit was provided, should throw error, testing px", () => {
            expect(() => {
                calcPx("px");
            }).toThrow(
                new Error(
                    "value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)",
                ),
            );
        });
        test("only unit was provided, should throw error, testing rem", () => {
            expect(() => {
                calcPx("rem");
            }).toThrow(
                new Error(
                    "value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)",
                ),
            );
        });
        test("only unit was provided, should throw error, testing em", () => {
            expect(() => {
                calcPx("em");
            }).toThrow(
                new Error(
                    "value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)",
                ),
            );
        });
        test("unsupported unit was provided, should throw error", () => {
            expect(() => {
                calcPx("12em");
            }).toThrow(new UnsupportedUnitError("em"));
        });
        test("invalid unit was provided, should throw error", () => {
            expect(() => {
                calcPx("12abc");
            }).toThrow(new Error("Invalid unit: abc"));
        });
        test("unit contained a valid value but was invalid, should throw error", () => {
            expect(() => {
                calcPx("12rem12");
            }).toThrow(
                new Error(
                    "value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)",
                ),
            );
        });
        test("invalid size, should throw error", () => {
            expect(() => {
                calcPx("1a2rem");
            }).toThrow(
                new Error(
                    "value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)",
                ),
            );
        });
        test("unit is repeated, should throw error", () => {
            expect(() => {
                calcPx("12pxpx");
            }).toThrow(new Error("Invalid unit: pxpx"));
        });
        test("invalid size, should throw error, contains multiple decimal points", () => {
            expect(() => {
                calcPx("12.1.1rem");
            }).toThrow(
                new Error('start of value "12.1.1" was not a valid number'),
            );
        });
        test("rem to px test", () => {
            expect(calcPx("96rem")).toBe(1536);
        });
        test("rem to px, decimal rem, decimal answer", () => {
            expect(calcPx("12.4512rem")).toBeCloseTo(199.2192, 4);
        });
        test("rem to px decimal rem, whole answer", () => {
            expect(calcPx("12.5rem")).toBeCloseTo(200);
        });
        test("px to px", () => {
            expect(calcPx("174px")).toBe(174);
        });
        test("px to px, decimal", () => {
            expect(calcPx("174.45px")).toBeCloseTo(174.45);
        });
    });

    describe("fluidCSSWidthScale tests", () => {
        const minScreen = "58rem";
        const devScreen = "96rem";
        const correctStringFormat = (
            min: string,
            pref: string,
            max: string,
        ) => {
            return `clamp(${min}, calc(${min} + (${pref} - ${min}) * ((100vw - ${minScreen}) / (${devScreen} - ${minScreen}))), ${max})`;
        };

        test("min is more than pref, should throw error", () => {
            const min = "10rem";
            const pref = "5rem";
            const max = "15rem";
            expect(() => {
                fluidCSSWidthScale(min, pref, max);
            }).toThrow(new Error(`min "${min}" is larger than pref "${pref}"`));
        });

        test("min and pref are more than max, should throw error", () => {
            const min = "15rem";
            const pref = "16rem";
            const max = "10rem";
            expect(() => {
                fluidCSSWidthScale(min, pref, max);
            }).toThrow(new Error(`min "${min}" is larger than max "${max}"`));
        });

        test("pref is more than max, should throw error", () => {
            const min = "10rem";
            const pref = "20rem";
            const max = "15rem";
            expect(() => {
                fluidCSSWidthScale(min, pref, max);
            }).toThrow(new Error(`pref "${pref}" is larger than max "${max}"`));
        });
        test("returns the correct string format", () => {
            const min = "10rem";
            const pref = "20rem";
            const max = "30rem";

            expect(fluidCSSWidthScale(min, pref, max)).toBe(
                correctStringFormat(min, pref, max),
            );
        });
        test("returns the correct string format, min, pref and max are all the same", () => {
            const value = "150px";
            expect(fluidCSSWidthScale(value, value, value)).toBe(
                correctStringFormat(value, value, value),
            );
        });
        test("returns the correct string format, uses valid css width units but unsupported by calcPx, should not throw error", () => {
            const min = "50em";
            const pref = "10vh";
            const max = "50mm";

            expect(fluidCSSWidthScale(min, pref, max)).toBe(
                correctStringFormat(min, pref, max),
            );
        });

        describe("tests for a function that ensures the calculations of fluidCSSWidthScale are correct", () => {
            const calcFluidWidthScale = (
                min: string,
                pref: string,
                max: string,
                viewportWidth: string,
            ) => {
                const minPx = calcPx(min);
                const maxPx = calcPx(max);
                const prefPx = calcPx(pref);
                const minScreenPx = calcPx(minScreen);
                const devScreenPx = calcPx(devScreen);

                const calc =
                    minPx +
                    (prefPx - minPx) *
                        ((calcPx(viewportWidth) - minScreenPx) /
                            (devScreenPx - minScreenPx));

                if (calc >= maxPx) {
                    return maxPx;
                } else if (calc <= minPx) {
                    return minPx;
                }

                return calc;
            };

            test("min, pref and max are all the same", () => {
                expect(
                    calcFluidWidthScale("150px", "150px", "150px", devScreen),
                ).toBe(150);
            });

            test("min, pref and max are all greater than viewport width", () => {
                const min = calcPx(devScreen) + 245;
                expect(
                    calcFluidWidthScale(
                        `${min}px`,
                        `${min * 1.25}px`,
                        `${min * 1.5}px`,
                        devScreen,
                    ),
                ).toBe(min * 1.25);
            });

            test("viewport Width is the same as dev width with differnt min and max", () => {
                expect(
                    calcFluidWidthScale("75px", "250px", "300px", devScreen),
                ).toBe(250);
            });

            test("viewport width is min screen", () => {
                expect(
                    calcFluidWidthScale("7px", "185px", "245px", minScreen),
                ).toBe(7);
            });

            test("viewport width is less than min screen", () => {
                const viewportWidth = calcPx(minScreen) - 30;
                expect(
                    calcFluidWidthScale(
                        "1290px",
                        "1386px",
                        "1536px",
                        `${viewportWidth}px`,
                    ),
                ).toBe(1290);
            });

            test("viewport width is half of dev screen", () => {
                const viewportWidth = calcPx(devScreen) / 2;
                expect(
                    calcFluidWidthScale(
                        "75px",
                        "150px",
                        "300px",
                        `${viewportWidth}px`,
                    ),
                ).toBe(75);
            });

            test("viewport width is much larger than dev screen", () => {
                const viewportWidth = calcPx(devScreen) * 5;
                expect(
                    calcFluidWidthScale(
                        "75px",
                        "150px",
                        "300px",
                        `${viewportWidth}px`,
                    ),
                ).toBe(300);
            });
        });
    });
});

describe("floor and ceil to 2dp tests", () => {
    describe("ceil2DP tests, should ceil to 2dp", () => {
        test("whole number, shouldnt  ceil", () => {
            expect(ceil2DP(5)).toBe(5);
        });
        test("large whole number, shouldnt  ceil", () => {
            expect(ceil2DP(10024)).toBe(10024);
        });
        test("negative whole number, shouldnt  ceil", () => {
            expect(ceil2DP(-17)).toBe(-17);
        });
        test("1dp, shouldnt  ceil", () => {
            expect(ceil2DP(0.7)).toBe(0.7);
        });
        test("1dp negative, shouldnt  ceil", () => {
            expect(ceil2DP(-0.7)).toBe(-0.7);
        });
        test("2dp, shouldnt  ceil", () => {
            expect(ceil2DP(9.85)).toBe(9.85);
        });
        test("2dp negative, shouldnt  ceil", () => {
            expect(ceil2DP(-9.85)).toBe(-9.85);
        });
        test("3dp, should ceil", () => {
            expect(ceil2DP(1024.855)).toBe(1024.86);
        });
        test("3dp negative, should ceil", () => {
            expect(ceil2DP(-1024.855)).toBe(-1024.85);
        });
        test("3dp, last digit below 5 should ceil", () => {
            expect(ceil2DP(7.721)).toBe(7.73);
        });
        test("3dp negative, should ceil", () => {
            expect(ceil2DP(-7.721)).toBe(-7.72);
        });
        test("3dp, previous digits are 9 should ceil", () => {
            expect(ceil2DP(99.991)).toBe(100);
        });
        test("3dp negative, cusp of 0 should ceil", () => {
            expect(ceil2DP(-0.001)).toBe(-0);
        });
        test("4dp, should ceil", () => {
            expect(ceil2DP(278.8501)).toBe(278.86);
        });
        test("4dp negative, should ceil", () => {
            expect(ceil2DP(-278.8501)).toBe(-278.85);
        });
        test("decimal type value, should ceil", () => {
            expect(ceil2DP(new Decimal(1.715))).toBe(1.72);
        });
        test("doesnt return decimal type, decimal input", () => {
            expect(ceil2DP(new Decimal(1.715))).not.toBeInstanceOf(Decimal);
        });
        test("doesnt return decimal type, number input", () => {
            expect(ceil2DP(1.715)).not.toBeInstanceOf(Decimal);
        });
    });

    describe("floor2DP tests, should floor to 2dp", () => {
        test("whole number, shouldnt  floor", () => {
            expect(floor2DP(5)).toBe(5);
        });
        test("large whole number, shouldnt floor", () => {
            expect(floor2DP(10024)).toBe(10024);
        });
        test("negative whole number, shouldnt  floor", () => {
            expect(floor2DP(-17)).toBe(-17);
        });
        test("1dp, shouldnt  floor", () => {
            expect(floor2DP(0.7)).toBe(0.7);
        });
        test("1dp negative, shouldnt  floor", () => {
            expect(floor2DP(-0.7)).toBe(-0.7);
        });
        test("2dp, shouldnt  floor", () => {
            expect(floor2DP(9.85)).toBe(9.85);
        });
        test("2dp negative, shouldnt  floor", () => {
            expect(floor2DP(-9.85)).toBe(-9.85);
        });
        test("3dp, should floor", () => {
            expect(floor2DP(1024.855)).toBe(1024.85);
        });
        test("3dp negative, should floor", () => {
            expect(floor2DP(-1024.855)).toBe(-1024.86);
        });
        test("3dp, last digit above 5 should ceil", () => {
            expect(floor2DP(7.726)).toBe(7.72);
        });
        test("3dp negative, should floor", () => {
            expect(floor2DP(-7.721)).toBe(-7.73);
        });

        test("4dp, should floor", () => {
            expect(floor2DP(278.8501)).toBe(278.85);
        });
        test("4dp negative, should floor", () => {
            expect(floor2DP(-278.8501)).toBe(-278.86);
        });
        test("decimal type value, should floor", () => {
            expect(floor2DP(new Decimal(1.715))).toBe(1.71);
        });
        test("doesnt return decimal type, decimal input", () => {
            expect(floor2DP(new Decimal(1.715))).not.toBeInstanceOf(Decimal);
        });
        test("doesnt return decimal type, number input", () => {
            expect(floor2DP(1.715)).not.toBeInstanceOf(Decimal);
        });
    });
});

describe("isValidNumberEntryTest, returns a boolean if a string is a valid number for monatry values", () => {
    test("Empty string is valid", () => {
        expect(isValidNumberEntry("")).toBe(true);
    });
    test("Whole numbers are valid", () => {
        expect(isValidNumberEntry("1247")).toBe(true);
    });
    test("negative number is not valid", () => {
        expect(isValidNumberEntry("-1247")).toBe(false);
    });
    test("decimal number with nothing after dp is not valid", () => {
        expect(isValidNumberEntry("28.")).toBe(false);
    });
    test("decimal number with 1dp is not valid", () => {
        expect(isValidNumberEntry("7.1")).toBe(false);
    });
    test("decimal number with 2dp is valid", () => {
        expect(isValidNumberEntry("19.74")).toBe(true);
    });
    test("decimal number with 3dp is not valid", () => {
        expect(isValidNumberEntry("19.741")).toBe(false);
    });
    test("decimal number with 4dp is not valid", () => {
        expect(isValidNumberEntry("2.1892")).toBe(false);
    });
});

describe("Rent Calculator helper function tests", () => {
    describe("calculateRent tests", () => {
        test("value is empty string, frequency is unselected", () => {
            const value = "";
            const rentFreq = RentFrequency.UNSELECTED;
            const expected: RentState = {
                rentFrequency: rentFreq,
                rentAmount: value,
                rentFrequencyIsValid: true,
                rentAmountIsValid: true,
                weeklyRent: "",
                fourWeeklyRent: "",
                monthlyRent: "",
            };
            expect(calculateRent(rentFreq, value)).toEqual(expected);
        });
        test("value is valid number entry, frequency is unselected", () => {
            const value = "25.60";
            const rentFreq = RentFrequency.UNSELECTED;
            const expected: RentState = {
                rentFrequency: rentFreq,
                rentAmount: value,
                rentFrequencyIsValid: false,
                rentAmountIsValid: true,
                weeklyRent: "",
                fourWeeklyRent: "",
                monthlyRent: "",
            };
            expect(calculateRent(rentFreq, value)).toEqual(expected);
        });
        test("value is invalid number entry, frequency is unselected", () => {
            const value = "1.605";
            const rentFreq = RentFrequency.UNSELECTED;
            const expected: RentState = {
                rentFrequency: rentFreq,
                rentAmount: value,
                rentFrequencyIsValid: false,
                rentAmountIsValid: false,
                weeklyRent: "",
                fourWeeklyRent: "",
                monthlyRent: "",
            };
            expect(calculateRent(rentFreq, value)).toEqual(expected);
        });
        test("value is negaative number entry, frequency is unselected", () => {
            const value = "-117.68";
            const rentFreq = RentFrequency.UNSELECTED;
            const expected: RentState = {
                rentFrequency: rentFreq,
                rentAmount: value,
                rentFrequencyIsValid: false,
                rentAmountIsValid: false,
                weeklyRent: "",
                fourWeeklyRent: "",
                monthlyRent: "",
            };
            expect(calculateRent(rentFreq, value)).toEqual(expected);
        });
        test.each([
            RentFrequency.WEEKLY,
            RentFrequency.FOUR_WEEKLY,
            RentFrequency.MONTHLY,
        ])(
            "value is empty, frequency is selected - frequency %s",
            (rentFreq) => {
                const value = "";
                const expected: RentState = {
                    rentFrequency: rentFreq,
                    rentAmount: value,
                    rentFrequencyIsValid: true,
                    rentAmountIsValid: true,
                    weeklyRent: "",
                    fourWeeklyRent: "",
                    monthlyRent: "",
                };
                expect(calculateRent(rentFreq, value)).toEqual(expected);
            },
        );
        test.each([
            ["80.64", "80.64", "322.56", "349.44"],
            ["96.70", "96.70", "386.80", "419.04"],
            ["21", "21.00", "84.00", "91.00"],
            ["5", "5.00", "20.00", "21.67"],
            ["1.25", "1.25", "5.00", "5.42"],
            ["0", "0.00", "0.00", "0.00"],
        ])(
            "value edge cases, value is %s frequency is weekly",
            (value, weekly, fourWeekly, monthly) => {
                const rentFreq = RentFrequency.WEEKLY;
                const expected: RentState = {
                    rentFrequency: rentFreq,
                    rentAmount: value,
                    rentFrequencyIsValid: true,
                    rentAmountIsValid: true,
                    weeklyRent: weekly,
                    fourWeeklyRent: fourWeekly,
                    monthlyRent: monthly,
                };
                expect(calculateRent(rentFreq, value)).toEqual(expected);
            },
        );
        test.each([
            ["80.64", "20.16", "80.64", "87.36"],
            ["96.70", "24.18", "96.70", "104.76"],
            ["21", "5.25", "21.00", "22.75"],
            ["5", "1.25", "5.00", "5.42"],
            ["125.70", "31.43", "125.70", "136.18"],
            ["0", "0.00", "0.00", "0.00"],
        ])(
            "value edge cases, value is %s frequency is four weekly",
            (value, weekly, fourWeekly, monthly) => {
                const rentFreq = RentFrequency.FOUR_WEEKLY;
                const expected: RentState = {
                    rentFrequency: rentFreq,
                    rentAmount: value,
                    rentFrequencyIsValid: true,
                    rentAmountIsValid: true,
                    weeklyRent: weekly,
                    fourWeeklyRent: fourWeekly,
                    monthlyRent: monthly,
                };
                expect(calculateRent(rentFreq, value)).toEqual(expected);
            },
        );
        test.each([
            ["80.64", "18.61", "74.44", "80.64"],
            ["960.70", "221.70", "886.80", "960.70"],
            ["2100", "484.62", "1938.47", "2100.00"],
            ["5", "1.16", "4.62", "5.00"],
            ["0", "0.00", "0.00", "0.00"],
        ])(
            "value edge cases, value is %s frequency is monthly",
            (value, weekly, fourWeekly, monthly) => {
                const rentFreq = RentFrequency.MONTHLY;
                const expected: RentState = {
                    rentFrequency: rentFreq,
                    rentAmount: value,
                    rentFrequencyIsValid: true,
                    rentAmountIsValid: true,
                    weeklyRent: weekly,
                    fourWeeklyRent: fourWeekly,
                    monthlyRent: monthly,
                };
                expect(calculateRent(rentFreq, value)).toEqual(expected);
            },
        );
    });
    describe("calculateShortfall tests", () => {
        test("value is empty string, benefit type is unselected", () => {
            const value = "";
            const benefitType = BenefitType.UNSELECTED;
            const weekly = "";
            const fourWeekly = "";
            const monthly = "";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: "",
                fourWeeklyShortfall: "",
                monthlyShortfall: "",
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });

        test.each([BenefitType.HOUSING_BENEFIT, BenefitType.UNIVERSAL_CREDIT])(
            "value is empty string, benefit type is %s",
            (benefitType) => {
                const value = "";
                const weekly = "";
                const fourWeekly = "";
                const monthly = "";

                const expected: ShortfallState = {
                    benefitType: benefitType,
                    benefitAmount: value,
                    benefitTypeIsValid: true,
                    benefitAmountIsValid: true,
                    weeklyShortfall: "",
                    fourWeeklyShortfall: "",
                    monthlyShortfall: "",
                };

                expect(
                    calculateShortfall(
                        benefitType,
                        value,
                        weekly,
                        fourWeekly,
                        monthly,
                    ),
                ).toEqual(expected);
            },
        );
        test("value is valid number, benefit type is unselected", () => {
            const value = "100.78";
            const benefitType = BenefitType.UNSELECTED;
            const weekly = "";
            const fourWeekly = "";
            const monthly = "";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: false,
                benefitAmountIsValid: true,
                weeklyShortfall: "",
                fourWeeklyShortfall: "",
                monthlyShortfall: "",
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
        test("value is valid number, benefit type is selected, weekly, four weekly and monthly are unselected", () => {
            const benefitType = BenefitType.HOUSING_BENEFIT;
            const value = "210.45";
            const weekly = "";
            const fourWeekly = "";
            const monthly = "";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: "",
                fourWeeklyShortfall: "",
                monthlyShortfall: "",
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
        test("value is negative, should not be valid", () => {
            const value = "-900.60";
            const benefitType = BenefitType.HOUSING_BENEFIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "";
            const fourWeeklyShortfall = "";
            const monthlyShortfall = "";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: false,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Housing Benefit, benefit amount is above four weekly", () => {
            const value = "900.60";
            const benefitType = BenefitType.HOUSING_BENEFIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "3.45";
            const fourWeeklyShortfall = "13.80";
            const monthlyShortfall = "14.95";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });

        test("values are non-empty and valid, benefit type is Housing Benefit, benefit amount is the same as four weekly", () => {
            const value = "886.80";
            const benefitType = BenefitType.HOUSING_BENEFIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "0.00";
            const fourWeeklyShortfall = "0.00";
            const monthlyShortfall = "0.00";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Housing Benefit, benefit amount is below four weekly", () => {
            const value = "800";
            const benefitType = BenefitType.HOUSING_BENEFIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "-21.70";
            const fourWeeklyShortfall = "-86.80";
            const monthlyShortfall = "-94.04";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Universal Credit, benefit amount is above monthly", () => {
            const value = "1000";
            const benefitType = BenefitType.UNIVERSAL_CREDIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "9.06";
            const fourWeeklyShortfall = "36.27";
            const monthlyShortfall = "39.30";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Universal Credit, benefit amount is the same as monthly", () => {
            const value = "960.70";
            const benefitType = BenefitType.UNIVERSAL_CREDIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "0.00";
            const fourWeeklyShortfall = "0.00";
            const monthlyShortfall = "0.00";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Universal Credit, benefit amount is below monthly", () => {
            const value = "810.74";
            const benefitType = BenefitType.UNIVERSAL_CREDIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "-34.61";
            const fourWeeklyShortfall = "-138.43";
            const monthlyShortfall = "-149.96";

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(
                calculateShortfall(
                    benefitType,
                    value,
                    weekly,
                    fourWeekly,
                    monthly,
                ),
            ).toEqual(expected);
        });
    });
    describe("calculateStaringBalance tests", () => {
        test("start date unselected, weeks until start date is -1", () => {
            const weeksUntilStartDate = -1;
            const currentBalance = "1000";
            const weeklyRent = "157.50";

            expect(
                calculateStartingBalance(
                    weeksUntilStartDate,
                    currentBalance,
                    weeklyRent,
                ),
            ).toBe("");
        });
        test("current balance is empty string", () => {
            const weeksUntilStartDate = 1;
            const currentBalance = "";
            const weeklyRent = "157.50";

            expect(
                calculateStartingBalance(
                    weeksUntilStartDate,
                    currentBalance,
                    weeklyRent,
                ),
            ).toBe("");
        });
        test("weeklyRent is empty string and weeksUntillStartDate is > 0, should return empty string", () => {
            const weeksUntilStartDate = 1;
            const currentBalance = "1000";
            const weeklyRent = "";

            expect(
                calculateStartingBalance(
                    weeksUntilStartDate,
                    currentBalance,
                    weeklyRent,
                ),
            ).toBe("");
        });
        test.each([
            [1, "0", "270.74", "270.74"],
            [1, "1000", "270.74", "1270.74"],
            [3, "0", "100.74", "302.22"],
            [3, "115.17", "100.74", "417.39"],
        ])(
            "Functionality check, weeksUntilStartDate %d, currentBalance %s, weeklyRent, %s",
            (weeksUntilStartDate, currentBalance, weeklyRent, expected) => {
                expect(
                    calculateStartingBalance(
                        weeksUntilStartDate,
                        currentBalance,
                        weeklyRent,
                    ),
                ).toBe(expected);
            },
        );
        test("weeklyRent is empty string and weeksUntillStartDate is 0, should return value", () => {
            const weeksUntilStartDate = 0;
            const currentBalance = "1000";
            const weeklyRent = "";

            expect(
                calculateStartingBalance(
                    weeksUntilStartDate,
                    currentBalance,
                    weeklyRent,
                ),
            ).toBe("1000.00");
        });
    });
    describe("calculateTotalInstallments tests", () => {
        test("starting balance is empty string, should return -1", () => {
            const startingBalance = "";
            const defaultAmount = "200";

            expect(
                calculateTotalInstallments(startingBalance, defaultAmount),
            ).toBe(-1);
        });
        test("default amount is empty string, should return -1", () => {
            const startingBalance = "2000.00";
            const defaultAmount = "";

            expect(
                calculateTotalInstallments(startingBalance, defaultAmount),
            ).toBe(-1);
        });
        test("default amount is negative, should return -1", () => {
            const startingBalance = "2000.00";
            const defaultAmount = "-200.00";

            expect(
                calculateTotalInstallments(startingBalance, defaultAmount),
            ).toBe(-1);
        });
        test("default amount is a factor of starting balance", () => {
            const startingBalance = "2000.00";
            const defaultAmount = "250";

            expect(
                calculateTotalInstallments(startingBalance, defaultAmount),
            ).toBe(8);
        });
        test("default amount is not factor of starting balance", () => {
            const startingBalance = "3680.20";
            const defaultAmount = "365.50";

            expect(
                calculateTotalInstallments(startingBalance, defaultAmount),
            ).toBe(11);
        });
    });
    describe("calculateInstallment tests (current installment number)", () => {
        test("forecastDate is before startDate, should return 0", () => {
            const startDate = dayjs("2026-04-16");
            const forecastDate = startDate.add(-29, "days");
            const paymentFrequency = InstallmentFrequency.UNSELECTED;

            expect(
                calculateInstallment(startDate, forecastDate, paymentFrequency),
            ).toBe(0);
        });
        test("forecastDate is after start date but paymentFreq is unselected, should return 0", () => {
            const startDate = dayjs("2026-04-16");
            const forecastDate = startDate.add(4, "weeks");
            const paymentFrequency = InstallmentFrequency.UNSELECTED;

            expect(
                calculateInstallment(startDate, forecastDate, paymentFrequency),
            ).toBe(0);
        });
        test.each([InstallmentFrequency.WEEKLY, InstallmentFrequency.MONTHLY])(
            "Payment Frequency is %s, forecast date is after start date",
            (paymentFrequency) => {
                const startDate = dayjs("2026-04-16");
                const forecastDate = startDate.add(
                    4,
                    paymentFrequency === InstallmentFrequency.WEEKLY
                        ? "weeks"
                        : "months",
                );

                expect(
                    calculateInstallment(
                        startDate,
                        forecastDate,
                        paymentFrequency,
                    ),
                ).toBe(5);
            },
        );
        test.each([InstallmentFrequency.WEEKLY, InstallmentFrequency.MONTHLY])(
            "Payment Frequency is %s, forecast date is the same as start date",
            (paymentFrequency) => {
                const startDate = dayjs("2026-04-16");
                const forecastDate = startDate.clone();

                expect(
                    calculateInstallment(
                        startDate,
                        forecastDate,
                        paymentFrequency,
                    ),
                ).toBe(1);
            },
        );
        test.each([InstallmentFrequency.WEEKLY, InstallmentFrequency.MONTHLY])(
            "Payment Frequency is %s, forecast date is 1 installment after start date",
            (paymentFrequency) => {
                const startDate = dayjs("2026-04-16");
                const forecastDate = startDate.add(
                    1,
                    paymentFrequency === InstallmentFrequency.WEEKLY
                        ? "week"
                        : "month",
                );

                expect(
                    calculateInstallment(
                        startDate,
                        forecastDate,
                        paymentFrequency,
                    ),
                ).toBe(2);
            },
        );
    });
    describe("calculateForecastDate tests, calculates forecast date as instalment number changes", () => {
        test("paymentFrequency is unselected, should be null", () => {
            const startDate = dayjs("2026-05-23");
            const minForecastDate = dayjs("2026-04-16");
            const paymentFrequency = InstallmentFrequency.UNSELECTED;
            const installmentNumber = 6;

            expect(
                calculateForecastDate(
                    startDate,
                    minForecastDate,
                    paymentFrequency,
                    installmentNumber,
                ),
            ).toEqual(null);
        });

        test.each([InstallmentFrequency.WEEKLY, InstallmentFrequency.MONTHLY])(
            "paymentFrequency is %s, more than installment number 1",
            (paymentFrequency) => {
                const startDate = dayjs("2026-05-23");
                const minForecastDate = dayjs("2026-04-16");
                const installmentNumber = 6;

                expect(
                    calculateForecastDate(
                        startDate,
                        minForecastDate,
                        paymentFrequency,
                        installmentNumber,
                    ),
                ).toEqual(
                    startDate.add(
                        5,
                        paymentFrequency === InstallmentFrequency.WEEKLY
                            ? "weeks"
                            : "months",
                    ),
                );
            },
        );
        test.each([InstallmentFrequency.WEEKLY, InstallmentFrequency.MONTHLY])(
            "paymentFrequency is %s, installment number is 1, should be start date",
            (paymentFrequency) => {
                const startDate = dayjs("2026-05-23");
                const minForecastDate = dayjs("2026-04-16");
                const installmentNumber = 1;

                expect(
                    calculateForecastDate(
                        startDate,
                        minForecastDate,
                        paymentFrequency,
                        installmentNumber,
                    ),
                ).toEqual(startDate);
            },
        );
        test.each([InstallmentFrequency.WEEKLY, InstallmentFrequency.MONTHLY])(
            "paymentFrequency is %s, installment number is 0",
            (paymentFrequency) => {
                const startDate = dayjs("2026-05-23");
                const minForecastDate = dayjs("2026-04-16");
                const installmentNumber = 0;

                expect(
                    calculateForecastDate(
                        startDate,
                        minForecastDate,
                        paymentFrequency,
                        installmentNumber,
                    ),
                ).toEqual(
                    startDate.add(
                        -1,
                        paymentFrequency === InstallmentFrequency.WEEKLY
                            ? "weeks"
                            : "months",
                    ),
                );
            },
        );
        test.each([InstallmentFrequency.WEEKLY, InstallmentFrequency.MONTHLY])(
            "paymentFrequency is %s, installment number is 0, min forcast date is less than forecastDate",
            (paymentFrequency) => {
                const startDate = dayjs("2026-05-23");
                const minForecastDate = startDate.add(
                    -3,
                    paymentFrequency === InstallmentFrequency.WEEKLY
                        ? "days"
                        : "weeks",
                );
                const installmentNumber = 0;

                expect(
                    calculateForecastDate(
                        startDate,
                        minForecastDate,
                        paymentFrequency,
                        installmentNumber,
                    ),
                ).toEqual(minForecastDate);
            },
        );
    });
    describe("forecastPaid tests, calculates how much of the balance would be paid", () => {
        test("defaultAmount is empty string, should return empty string", () => {
            const installmentNumber = 0;
            const defaultAmount = "";
            const startingBalance = "2000.15";

            expect(
                calculateForecastPaid(
                    installmentNumber,
                    defaultAmount,
                    startingBalance,
                ),
            ).toBe("");
        });
        test("startingBalance is empty string, should return empty string", () => {
            const installmentNumber = 0;
            const defaultAmount = "200";
            const startingBalance = "";

            expect(
                calculateForecastPaid(
                    installmentNumber,
                    defaultAmount,
                    startingBalance,
                ),
            ).toBe("");
        });
        test("defaultAmount is negative, should return empty string", () => {
            const installmentNumber = 0;
            const defaultAmount = "-200";
            const startingBalance = "2000.15";

            expect(
                calculateForecastPaid(
                    installmentNumber,
                    defaultAmount,
                    startingBalance,
                ),
            ).toBe("");
        });
        test("installmentNumber is 0, should return 0", () => {
            const installmentNumber = 0;
            const defaultAmount = "200";
            const startingBalance = "2000.15";

            expect(
                calculateForecastPaid(
                    installmentNumber,
                    defaultAmount,
                    startingBalance,
                ),
            ).toBe("0.00");
        });
        test("installmentNumber is 1, should return defaultAmount", () => {
            const installmentNumber = 1;
            const defaultAmount = "200.00";
            const startingBalance = "2000.15";

            expect(
                calculateForecastPaid(
                    installmentNumber,
                    defaultAmount,
                    startingBalance,
                ),
            ).toBe(defaultAmount);
        });
        test("installmentNumber is less than final installment", () => {
            const installmentNumber = 9;
            const defaultAmount = "200.00";
            const startingBalance = "2000.15";

            expect(
                calculateForecastPaid(
                    installmentNumber,
                    defaultAmount,
                    startingBalance,
                ),
            ).toBe("1800.00");
        });
        test("installmentNumber is final installment", () => {
            const installmentNumber = 11;
            const defaultAmount = "200.00";
            const startingBalance = "2000.15";

            expect(
                calculateForecastPaid(
                    installmentNumber,
                    defaultAmount,
                    startingBalance,
                ),
            ).toBe(startingBalance);
        });
    });
    describe("balanceRemaining tests, calculates how much of the balance is left to pay", () => {
        test("starting balance is empty string, should return empty string", () => {
            const startingBalance = "";
            const totalPaid = "350.00";

            expect(calculateBalanceRemaining(startingBalance, totalPaid)).toBe(
                "",
            );
        });
        test("totalPaid is empty string, should return empty string", () => {
            const startingBalance = "2500.00";
            const totalPaid = "";

            expect(calculateBalanceRemaining(startingBalance, totalPaid)).toBe(
                "",
            );
        });
        test("totalPaid is less than startingBalance", () => {
            const startingBalance = "2500.00";
            const totalPaid = "350.00";

            expect(calculateBalanceRemaining(startingBalance, totalPaid)).toBe(
                "2150.00",
            );
        });
        test("totalPaid is the same as startingBalance", () => {
            const startingBalance = "2500.00";
            const totalPaid = "2500.00";

            expect(calculateBalanceRemaining(startingBalance, totalPaid)).toBe(
                "0.00",
            );
        });
    });
    describe("calculateForecast tests", () => {
        const generateForecast = (
            defaultAmount: string,
            forecastDate: Dayjs | null,
        ): ForecastState => {
            return {
                totalInstallments: -1,
                installmentNumber: 0,
                forecastPaid: "",
                balanceRemaining: "",
                defaultAmount: defaultAmount,
                defaultAmountIsValid: true,
                forecastDate: forecastDate,
                forecastDateIsValid: true,
                minForecastDate: dayjs("2026-04-12"),
                paymentFrequency: InstallmentFrequency.WEEKLY,
                paymentFrequencyIsValid: true,
            };
        };
        test("default amount is empty string, total installments is -1", () => {
            const defaultAmount = "";
            const startingBalance = "2000.00";
            const forecastDate = dayjs("2026-05-30");
            const forecast = generateForecast(defaultAmount, forecastDate);
            const startDate = dayjs("2026-05-01");

            const result: ForecastState = {
                totalInstallments: -1,
                installmentNumber: 0,
                forecastPaid: "",
                balanceRemaining: "",
                defaultAmount: forecast.defaultAmount,
                defaultAmountIsValid: forecast.defaultAmountIsValid,
                forecastDate: forecast.forecastDate,
                forecastDateIsValid: forecast.forecastDateIsValid,
                minForecastDate: forecast.minForecastDate,
                paymentFrequency: forecast.paymentFrequency,
                paymentFrequencyIsValid: forecast.paymentFrequencyIsValid,
            };

            expect(
                calculateForecast(
                    startingBalance,
                    startDate,
                    true,
                    forecast,
                    true,
                ),
            ).toEqual(result);
        });
        test("forecast date is less than total installments away", () => {
            const defaultAmount = "250.00";
            const startingBalance = "2000.00";
            const forecastDate = dayjs("2026-05-30");
            const forecast = generateForecast(defaultAmount, forecastDate);
            const startDate = dayjs("2026-05-01");

            const result: ForecastState = {
                totalInstallments: 8,
                installmentNumber: 5,
                forecastPaid: "1250.00",
                balanceRemaining: "750.00",
                defaultAmount: forecast.defaultAmount,
                defaultAmountIsValid: forecast.defaultAmountIsValid,
                forecastDate: forecast.forecastDate,
                forecastDateIsValid: forecast.forecastDateIsValid,
                minForecastDate: forecast.minForecastDate,
                paymentFrequency: forecast.paymentFrequency,
                paymentFrequencyIsValid: forecast.paymentFrequencyIsValid,
            };
            expect(
                calculateForecast(
                    startingBalance,
                    startDate,
                    true,
                    forecast,
                    true,
                ),
            ).toEqual(result);
        });
        test("forecast date is null", () => {
            const defaultAmount = "250.00";
            const startingBalance = "2000.00";
            const forecastDate = null;
            const forecast = generateForecast(defaultAmount, forecastDate);
            const startDate = dayjs("2026-05-01");

            const result: ForecastState = {
                totalInstallments: 8,
                installmentNumber: forecast.installmentNumber,
                forecastPaid: "0.00",
                balanceRemaining: "2000.00",
                defaultAmount: forecast.defaultAmount,
                defaultAmountIsValid: forecast.defaultAmountIsValid,
                forecastDate: forecast.forecastDate,
                forecastDateIsValid: forecast.forecastDateIsValid,
                minForecastDate: forecast.minForecastDate,
                paymentFrequency: forecast.paymentFrequency,
                paymentFrequencyIsValid: forecast.paymentFrequencyIsValid,
            };
            expect(
                calculateForecast(
                    startingBalance,
                    startDate,
                    true,
                    forecast,
                    true,
                ),
            ).toEqual(result);
        });
        test("calc installments is false", () => {
            const defaultAmount = "250.00";
            const startingBalance = "2000.00";
            const forecastDate = dayjs("2026-05-30");
            const forecast = generateForecast(defaultAmount, forecastDate);
            const startDate = dayjs("2026-05-01");

            forecast.installmentNumber = 2;

            const result: ForecastState = {
                totalInstallments: 8,
                installmentNumber: forecast.installmentNumber,
                forecastPaid: "500.00",
                balanceRemaining: "1500.00",
                defaultAmount: forecast.defaultAmount,
                defaultAmountIsValid: forecast.defaultAmountIsValid,
                forecastDate: forecast.forecastDate,
                forecastDateIsValid: forecast.forecastDateIsValid,
                minForecastDate: forecast.minForecastDate,
                paymentFrequency: forecast.paymentFrequency,
                paymentFrequencyIsValid: forecast.paymentFrequencyIsValid,
            };
            expect(
                calculateForecast(
                    startingBalance,
                    startDate,
                    true,
                    forecast,
                    false,
                ),
            ).toEqual(result);
        });
    });
});
