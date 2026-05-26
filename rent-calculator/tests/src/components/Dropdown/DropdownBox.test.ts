import { expect, describe, test } from "@jest/globals";
import { calcDropdownMinWidth } from "@/src/components/Dropdown/DropdownBox";


describe("calcDropdownMinWidth tests", () => {
    test.each([[7,10.3125], [4, 7.5], [13,15.9375]])("default dropdown, large screen tests, max label length %d, expected %d", (labelLength, expected) => {
        expect(calcDropdownMinWidth({maxLabelLength:labelLength, screenSize:"LARGE", dropdownStyle:"DEFAULT"})).toBeCloseTo(expected,4);
    });
    test.each([[7,7.875], [4, 6], [13,11.625]])("default dropdown, medium screen tests, max label length %d, expected %d", (labelLength, expected) => {
        expect(calcDropdownMinWidth({maxLabelLength:labelLength, screenSize:"MEDIUM", dropdownStyle:"DEFAULT"})).toBeCloseTo(expected,4);
    });
    test.each([[7,7.1875], [4, 5.5], [13,10.5625]])("default dropdown, small screen tests, max label length %d, expected %d", (labelLength, expected) => {
        expect(calcDropdownMinWidth({maxLabelLength:labelLength, screenSize:"SMALL", dropdownStyle:"DEFAULT"})).toBeCloseTo(expected,4);
    });
    test.each([[7, 4, 6.75], [14, 9, 10.5], [4,2,5.25], [5,5, 7.5]])("small dropdown, large screen tests, max label length %d, longest word length %d, expected %d", (labelLength, maxWordLength, expected) => {
        expect(calcDropdownMinWidth({maxLabelLength:labelLength, screenSize:"LARGE", dropdownStyle:"SMALL", longestWordLength:maxWordLength})).toBeCloseTo(expected,4);
    });
    test.each([[7, 4, 5.75], [14, 9, 8.5625], [4,2,4.625], [5,5, 6.3125]])("small dropdown, medium screen tests, max label length %d, longest word length %d, expected %d", (labelLength, maxWordLength, expected) => {
        expect(calcDropdownMinWidth({maxLabelLength:labelLength, screenSize:"MEDIUM", dropdownStyle:"SMALL", longestWordLength:maxWordLength})).toBeCloseTo(expected,4);
    });
    test.each([[7, 4, 5.25], [14, 9, 7.75], [4,2,4.25], [5,5, 5.75]])("small dropdown, small screen tests, max label length %d, longest word length %d, expected %d", (labelLength, maxWordLength, expected) => {
        expect(calcDropdownMinWidth({maxLabelLength:labelLength, screenSize:"SMALL", dropdownStyle:"SMALL", longestWordLength:maxWordLength})).toBeCloseTo(expected,4);
    });
});