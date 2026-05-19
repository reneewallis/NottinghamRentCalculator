import { calcPx, fluidCSSWidthScale, getMaxTabs, UnsupportedUnitError } from "@/src/utils/helperFunctions";
import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals"

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