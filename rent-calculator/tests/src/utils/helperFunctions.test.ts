import { BenefitType, RentFrequency, RentState, ShortfallState } from "@/src/types/RentCalculator";
import { calcPx, calculateRent, calculateShortfall, ceil2DP, floor2DP, fluidCSSWidthScale, getMaxTabs, isValidNumberEntry, UnsupportedUnitError } from "@/src/utils/helperFunctions";
import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals"
import Decimal from "decimal.js";

describe("getMaxTabs test, viewportWidth is in Rem, minimum size is 0", () => {
    test("Minimum viewport size", () =>{
        expect(getMaxTabs(0)).toBe(1);
    });

    test("Dev viewport size", ()=>{
        expect(getMaxTabs(96)).toBe(17);
    });

    test("tablet", ()=>{
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
            expect(() => {calcPx("px")}).toThrow(new Error("value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)"));
        })  
        test("only unit was provided, should throw error, testing rem", () => {
            expect(() => {calcPx("rem")}).toThrow(new Error("value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)"));
        })  
        test("only unit was provided, should throw error, testing em", () => {
            expect(() => {calcPx("em")}).toThrow(new Error("value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)"));
        })  
        test("unsupported unit was provided, should throw error", () => {
            expect(() => {calcPx("12em")}).toThrow(new UnsupportedUnitError("em"));
        })  
        test("invalid unit was provided, should throw error", () => {
            expect(() => {calcPx("12abc")}).toThrow(new Error("Invalid unit: abc"));
        })  
        test("unit contained a valid value but was invalid, should throw error", () => {
            expect(() => {calcPx("12rem12")}).toThrow(new Error("value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)"));
        })  
        test("invalid size, should throw error", () => {
            expect(() => {calcPx("1a2rem")}).toThrow(new Error("value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)"));
        })  
        test("unit is repeated, should throw error", () => {
            expect(() => {calcPx("12pxpx")}).toThrow(new Error("Invalid unit: pxpx"));
        })  
        test("invalid size, should throw error, contains multiple decimal points", () => {
            expect(() => {calcPx("12.1.1rem")}).toThrow(new Error("start of value \"12.1.1\" was not a valid number"));
        })  
        test("rem to px test", () => {
            expect(calcPx("96rem")).toBe(1536);
        })  
        test("rem to px, decimal rem, decimal answer", () => {
            expect(calcPx("12.4512rem")).toBeCloseTo(199.2192, 4);
        })  
        test("rem to px decimal rem, whole answer", () => {
            expect(calcPx("12.5rem")).toBeCloseTo(200);
        })  
        test("px to px", () => {
            expect(calcPx("174px")).toBe(174);
        })  
        test("px to px, decimal", () => {
            expect(calcPx("174.45px")).toBeCloseTo(174.45);
        });
    });

    describe("fluidCSSWidthScale tests", () =>{
        const minScreen = "22.5rem";
        const devScreen = "96rem";
        const correctStringFormat = (min:string, pref:string, max:string) => {
            return `clamp(${min}, calc(${min} + (${pref} - ${min}) * ((100vw - ${minScreen}) / (${devScreen} - ${minScreen}))), ${max})`;
        };

        const mockViewportWidth = (viewpotWidth: number) => {
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: viewpotWidth,
            });
        };

        test("min is more than pref, should throw error", ()=>{
            const min = "10rem";
            const pref = "5rem";
            const max = "15rem"
            expect(()=>{fluidCSSWidthScale(min,pref,max)}).toThrow(new Error(`min "${min}" is larger than pref "${pref}"`));
        });

        test("min and pref are more than max, should throw error", ()=>{
            const min = "15rem";
            const pref = "16rem";
            const max = "10rem"
            expect(()=>{fluidCSSWidthScale(min,pref,max)}).toThrow(new Error(`min "${min}" is larger than max "${max}"`));
        });

        test("pref is more than max, should throw error", ()=>{
            const min = "10rem";
            const pref = "20rem";
            const max = "15rem"
            expect(()=>{fluidCSSWidthScale("10rem","20rem","15rem")}).toThrow(new Error(`pref "${pref}" is larger than max "${max}"`));
        });
        test("returns the correct string format", () => {
            const min = "10rem";
            const pref = "20rem";
            const max = "30rem";

            expect(fluidCSSWidthScale(min, pref, max)).toBe(correctStringFormat(min,pref,max));
        });
        test("returns the correct string format, min, pref and max are all the same", ()=>{
            const value = "150px";
            expect(fluidCSSWidthScale(value, value, value)).toBe(correctStringFormat(value,value,value)); 
        });
        test("returns the correct string format, uses valid css width units but unsupported by calcPx, should not throw error", () => {
            const min = "50em";
            const pref = "10vh";
            const max = "50mm";

            expect(fluidCSSWidthScale(min, pref, max)).toBe(correctStringFormat(min,pref,max));
        });

        describe("tests for a function that ensures the calculations of fluidCSSWidthScale are correct", () => {
            const calcFluidWidthScale = (min:string, pref:string, max:string, viewportWidth: string) => {
                const minPx = calcPx(min);
                const maxPx = calcPx(max);
                const prefPx = calcPx(pref);
                const minScreenPx = calcPx(minScreen);
                const devScreenPx = calcPx(devScreen);

                const calc = minPx + ((prefPx- minPx) * ((calcPx(viewportWidth) - minScreenPx)/(devScreenPx - minScreenPx)));

                if (calc >= maxPx){
                    return maxPx;
                }
                else if (calc <= minPx){
                    return minPx;
                }

                return calc;

            };

            test("min, pref and max are all the same", ()=>{
                expect(calcFluidWidthScale("150px","150px","150px",devScreen)).toBe(150); 
            });

            test("min, pref and max are all greater than viewport width", ()=>{
                const min = calcPx(devScreen) + 245;
                expect(calcFluidWidthScale(`${min}px`,`${min*1.25}px`,`${min*1.5}px`,devScreen)).toBe(min*1.25); 
            });

            test("viewport Width is the same as dev width with differnt min and max", ()=>{
                expect(calcFluidWidthScale("75px","250px","300px",devScreen)).toBe(250); 
            });

            test("viewport width is min screen", ()=>{
                expect(calcFluidWidthScale("7px","185px","245px",minScreen)).toBe(7); 
            });

            test("viewport width is less than min screen", ()=>{
                const viewportWidth = calcPx(minScreen) - 30
                expect(calcFluidWidthScale("1290px","1386px","1536px",`${viewportWidth}px`)).toBe(1290); 
            });

            test("viewport width is half of dev screen", ()=>{
                const viewportWidth = calcPx(devScreen) / 2;
                expect(calcFluidWidthScale("75px","150px","300px",`${viewportWidth}px`)).toBeCloseTo(101.02); 
            });

            test("viewport width is much larger than dev screen", ()=>{
                const viewportWidth = calcPx(devScreen) * 5;
                expect(calcFluidWidthScale("75px","150px","300px",`${viewportWidth}px`)).toBe(300); 
            });
        });
    });
});

describe("floor and ceil to 2dp tests", () => {

    describe("ceil2DP tests, should ceil to 2dp", () =>{
        test("whole number, shouldnt  ceil", () =>{
            expect(ceil2DP(5)).toBe(5);
        });
        test("large whole number, shouldnt  ceil", () =>{
            expect(ceil2DP(10024)).toBe(10024);
        });
        test("negative whole number, shouldnt  ceil", () =>{
            expect(ceil2DP(-17)).toBe(-17);
        });
        test("1dp, shouldnt  ceil", () =>{
            expect(ceil2DP(0.7)).toBe(0.7);
        });
        test("1dp negative, shouldnt  ceil", () =>{
            expect(ceil2DP(-0.7)).toBe(-0.7);
        });
        test("2dp, shouldnt  ceil", () =>{
            expect(ceil2DP(9.85)).toBe(9.85);
        });
        test("2dp negative, shouldnt  ceil", () =>{
            expect(ceil2DP(-9.85)).toBe(-9.85);
        });
        test("3dp, should ceil", () =>{
            expect(ceil2DP(1024.855)).toBe(1024.86);
        });
        test("3dp negative, should ceil", () =>{
            expect(ceil2DP(-1024.855)).toBe(-1024.85);
        });
        test("3dp, last digit below 5 should ceil", () =>{
            expect(ceil2DP(7.721)).toBe(7.73);
        });
        test("3dp negative, should ceil", () =>{
            expect(ceil2DP(-7.721)).toBe(-7.72);
        });
        test("3dp, previous digits are 9 should ceil", () =>{
            expect(ceil2DP(99.991)).toBe(100);
        });
        test("3dp negative, cusp of 0 should ceil", () =>{
            expect(ceil2DP(-0.001)).toBe(-0);
        });
        test("4dp, should ceil", () =>{
            expect(ceil2DP(278.8501)).toBe(278.86);
        });
        test("4dp negative, should ceil", () =>{
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

    describe("floor2DP tests, should floor to 2dp", () =>{
        test("whole number, shouldnt  floor", () =>{
            expect(floor2DP(5)).toBe(5);
        });
        test("large whole number, shouldnt floor", () =>{
            expect(floor2DP(10024)).toBe(10024);
        });
        test("negative whole number, shouldnt  floor", () =>{
            expect(floor2DP(-17)).toBe(-17);
        });
        test("1dp, shouldnt  floor", () =>{
            expect(floor2DP(0.7)).toBe(0.7);
        });
        test("1dp negative, shouldnt  floor", () =>{
            expect(floor2DP(-0.7)).toBe(-0.7);
        });
        test("2dp, shouldnt  floor", () =>{
            expect(floor2DP(9.85)).toBe(9.85);
        });
        test("2dp negative, shouldnt  floor", () =>{
            expect(floor2DP(-9.85)).toBe(-9.85);
        });
        test("3dp, should floor", () =>{
            expect(floor2DP(1024.855)).toBe(1024.85);
        });
        test("3dp negative, should floor", () =>{
            expect(floor2DP(-1024.855)).toBe(-1024.86);
        });
        test("3dp, last digit above 5 should ceil", () =>{
            expect(floor2DP(7.726)).toBe(7.72);
        });
        test("3dp negative, should floor", () =>{
            expect(floor2DP(-7.721)).toBe(-7.73);
        });

        test("4dp, should floor", () =>{
            expect(floor2DP(278.8501)).toBe(278.85);
        });
        test("4dp negative, should floor", () =>{
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
    test("Empty string is valid", ()=>{
        expect(isValidNumberEntry("")).toBe(true);
    });
    test("Whole numbers are valid", ()=>{
        expect(isValidNumberEntry("1247")).toBe(true);
    });
    test("negative number is not valid", ()=>{
        expect(isValidNumberEntry("-1247")).toBe(false);
    });
    test("decimal number with nothing after dp is not valid",()=>{
        expect(isValidNumberEntry("28.")).toBe(false);
    });
    test("decimal number with 1dp is not valid", ()=>{
        expect(isValidNumberEntry("7.1")).toBe(false);
    });
    test("decimal number with 2dp is valid", ()=>{
        expect(isValidNumberEntry("19.74")).toBe(true);
    });
    test("decimal number with 3dp is not valid", ()=>{
        expect(isValidNumberEntry("19.741")).toBe(false);
    });
    test("decimal number with 4dp is not valid", ()=>{
        expect(isValidNumberEntry("2.1892")).toBe(false);
    });
});

describe("Rent Calculator helper function tests", ()=>{
    describe("calculateRent tests", ()=>{
        test("value is empty string, frequency is unselected", ()=>{
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
        test("value is valid number entry, frequency is unselected", ()=>{
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
        test("value is invalid number entry, frequency is unselected", ()=>{
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
        test("value is negaative number entry, frequency is unselected", ()=>{
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
        test.each([RentFrequency.WEEKLY, RentFrequency.FOUR_WEEKLY, RentFrequency.MONTHLY])("value is empty, frequency is selected - frequency %s", (rentFreq)=>{
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
        });
        test.each([["80.64","80.64","322.56", "349.44"], ["96.70","96.70","386.80", "419.04"], ["21","21.00","84.00", "91.00"], ["5","5.00","20.00", "21.67"], ["1.25","1.25","5.00","5.42"], ["0", "0.00", "0.00", "0.00"]])("value edge cases, value is %s frequency is weekly", (value, weekly, fourWeekly, monthly)=>{
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
        });
        test.each([["80.64","20.16","80.64","87.36"], ["96.70","24.18","96.70","104.76"], ["21","5.25","21.00","22.75"], ["5","1.25","5.00","5.42"], ["125.70","31.43","125.70","136.18"], ["0", "0.00", "0.00", "0.00"]])("value edge cases, value is %s frequency is four weekly", (value, weekly, fourWeekly, monthly)=>{
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
        });
        test.each([["80.64","18.61","74.44","80.64"], ["960.70","221.70","886.80","960.70"], ["2100","484.62","1938.47","2100.00"], ["5","1.16","4.62","5.00"], ["0", "0.00", "0.00", "0.00"]])("value edge cases, value is %s frequency is monthly", (value, weekly, fourWeekly, monthly)=>{
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
        });
    });
    describe("calculateShortfall tests", () => {
        test("value is empty string, benefit type is unselected", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });

        test.each([BenefitType.HOUSING_BENEFIT, BenefitType.UNIVERSAL_CREDIT])("value is empty string, benefit type is %s", (benefitType)=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("value is valid number, benefit type is unselected", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("value is valid number, benefit type is selected, weekly, four weekly and monthly are unselected", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Housing Benefit, benefit amount is above four weekly", ()=>{
            const value = "900.60";
            const benefitType = BenefitType.HOUSING_BENEFIT;
            const weekly = "221.70";
            const fourWeekly = "886.80";
            const monthly = "960.70";

            const weeklyShortfall = "3.45";
            const fourWeeklyShortfall = "13.80";
            const monthlyShortfall = "14.95";

            console.log(ceil2DP((+value * 13) / 12));
            console.log(ceil2DP((+value  * 13) / 12) - +monthly);
            console.log((ceil2DP((+value  * 13) / 12) - +monthly).toFixed(2));

            const expected: ShortfallState = {
                benefitType: benefitType,
                benefitAmount: value,
                benefitTypeIsValid: true,
                benefitAmountIsValid: true,
                weeklyShortfall: weeklyShortfall,
                fourWeeklyShortfall: fourWeeklyShortfall,
                monthlyShortfall: monthlyShortfall,
            };

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Housing Benefit, benefit amount is the same as four weekly", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Housing Benefit, benefit amount is below four weekly", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Universal Credit, benefit amount is above monthly", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Universal Credit, benefit amount is the same as monthly", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
        test("values are non-empty and valid, benefit type is Universal Credit, benefit amount is below monthly", ()=>{
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

            expect(calculateShortfall(benefitType, value, weekly, fourWeekly, monthly)).toEqual(expected);
        });
    });
});