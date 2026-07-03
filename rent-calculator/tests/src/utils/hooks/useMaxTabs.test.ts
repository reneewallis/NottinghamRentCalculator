import { beforeEach, describe, expect, jest, test } from "@jest/globals";

jest.mock("@/src/utils/hooks/useViewportWidth", () => {
    const actual = jest.requireActual("@/src/utils/hooks/useViewportWidth");
    return Object.assign({ __esModule: true }, actual, { useViewportWidthRem: jest.fn() });
});

jest.mock("@/src/utils/hooks/useElementWidth", () => {
    const actual = jest.requireActual("@/src/utils/hooks/useElementWidth");

    return Object.assign({ __esModule: true }, actual, { useElementWidthRem: jest.fn() });
});

import { renderHook } from "@testing-library/react";

import { getMaxTabs } from "@/src/utils/helperFunctions";
import { useElementWidthRem } from "@/src/utils/hooks/useElementWidth";
import { useMaxTabs } from "@/src/utils/hooks/useMaxTabs";
import { useViewportWidthRem } from "@/src/utils/hooks/useViewportWidth";

const mockedUseViewportRem = useViewportWidthRem as jest.Mock;
const mockedUseElementRem = useElementWidthRem as jest.Mock;

describe("useMaxTabs tests", () => {
    const defaultRef = () => {};
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([true, false])("returns correct properties", (containerIsViewport) => {
        mockedUseElementRem.mockReturnValue({ ref: defaultRef, width: 0 });
        mockedUseViewportRem.mockReturnValue(0);
        const { result } = renderHook(() =>
            useMaxTabs(containerIsViewport ? "viewport" : "element"),
        );

        expect(result.current).toHaveProperty("maxTabs");
        expect(result.current).toHaveProperty("ref");
    });

    describe("container is viewport tests", () => {
        beforeEach(() => {
            mockedUseElementRem.mockReturnValue({ ref: defaultRef, width: 0 });
        });
        test("doesnt return element max tabs", () => {
            const elementWidth = 96;
            const elementMaxTabs = getMaxTabs(elementWidth);

            mockedUseViewportRem.mockReturnValue(0);
            mockedUseElementRem.mockReturnValue({
                ref: defaultRef,
                width: elementWidth,
            });

            const { result } = renderHook(() => useMaxTabs("viewport"));

            expect(result.current.maxTabs).not.toBe(elementMaxTabs);
        });
        test("returns element ref", () => {
            mockedUseViewportRem.mockReturnValue(0);

            const { result } = renderHook(() => useMaxTabs("viewport"));
            expect(result.current.ref).toBe(defaultRef);
        });
        test("dev screen max tabs", () => {
            mockedUseViewportRem.mockReturnValue(96);

            const { result } = renderHook(() => useMaxTabs("viewport"));

            expect(result.current).toEqual({ ref: defaultRef, maxTabs: 17 });
        });

        test("tablet max tabs", () => {
            mockedUseViewportRem.mockReturnValue(48);

            const { result } = renderHook(() => useMaxTabs("viewport"));

            expect(result.current).toEqual({ ref: defaultRef, maxTabs: 8 });
        });

        test("zero width, should return 1", () => {
            mockedUseViewportRem.mockReturnValue(0);

            const { result } = renderHook(() => useMaxTabs("viewport"));

            expect(result.current).toEqual({ ref: defaultRef, maxTabs: 1 });
        });

        test("uses viewport without container value provided", () => {
            mockedUseViewportRem.mockReturnValue(96);
            const { result } = renderHook(() => useMaxTabs());

            expect(result.current).toEqual({ ref: defaultRef, maxTabs: 17 });
        });
    });

    describe("container is element tests", () => {
        test("ref should be the same ref returned by useElement", () => {
            mockedUseElementRem.mockReturnValue({ ref: defaultRef, width: 0 });

            const { result } = renderHook(() => useMaxTabs("element"));
            expect(result.current.ref).toBe(defaultRef);
        });

        test("element is selected, should not use viewport width", () => {
            const viewportWidth = 127;
            const viewportMaxTabs = getMaxTabs(viewportWidth);
            mockedUseViewportRem.mockReturnValue(viewportWidth);
            mockedUseElementRem.mockReturnValue({ ref: defaultRef, width: 0 });

            const { result } = renderHook(() => useMaxTabs("element"));

            expect(result.current.maxTabs).not.toBe(viewportMaxTabs);
        });

        test("small container", () => {
            const elementWidth = 20;
            mockedUseElementRem.mockReturnValue({
                ref: defaultRef,
                width: elementWidth,
            });

            const { result } = renderHook(() => useMaxTabs("element"));

            expect(result.current).toEqual({ maxTabs: 2, ref: defaultRef });
        });

        test("medium container", () => {
            mockedUseElementRem.mockReturnValue({ ref: defaultRef, width: 50 });

            const { result } = renderHook(() => useMaxTabs("element"));

            expect(result.current).toEqual({ maxTabs: 8, ref: defaultRef });
        });

        test("zero width container", () => {
            mockedUseElementRem.mockReturnValue({ ref: defaultRef, width: 0 });

            const { result } = renderHook(() => useMaxTabs("element"));

            expect(result.current).toEqual({ maxTabs: 1, ref: defaultRef });
        });

        test("Ref provided, container width larger than viewport", () => {
            mockedUseViewportRem.mockReturnValue(96);
            mockedUseElementRem.mockReturnValue({
                ref: defaultRef,
                width: 175,
            });

            const { result } = renderHook(() => useMaxTabs("element"));

            expect(result.current).toEqual({ maxTabs: 32, ref: defaultRef });
        });
    });
});
