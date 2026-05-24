import { describe, expect, jest, test, beforeEach } from "@jest/globals";

jest.mock("@/src/utils/hooks/useViewportWidth", () => {
    const actual = jest.requireActual("@/src/utils/hooks/useViewportWidth") as typeof import("@/src/utils/hooks/useViewportWidth");

    return {
        __esModule: true,
        ...actual,
        useViewportWidthRem: jest.fn(),
    };
});

jest.mock("@/src/utils/hooks/useElementWidth", () => {
    const actual = jest.requireActual("@/src/utils/hooks/useElementWidth") as typeof import("@/src/utils/hooks/useElementWidth");

    return {
        __esModule: true,
        ...actual,
        useElementWidthRem: jest.fn(),
    };
})

import { renderHook } from "@testing-library/react";
import { useViewportWidthRem } from "@/src/utils/hooks/useViewportWidth";
import { useMaxTabs } from "@/src/utils/hooks/useMaxTabs";
import { useElementWidthRem } from "@/src/utils/hooks/useElementWidth";
import { afterEach } from "node:test";
import { RefObject } from "react";

const mockedUseViewportRem = useViewportWidthRem as jest.Mock;
const mockedUseElementRem = useElementWidthRem as jest.Mock;

describe("useMaxTabs tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Viewport width tests, no element ref provided", () => {
        test("dev screen max tabs", () => {
            mockedUseViewportRem.mockReturnValue(96);

            const { result } = renderHook(() => useMaxTabs());

            expect(result.current).toBe(17);
        });

        test("tablet max tabs", () => {
            mockedUseViewportRem.mockReturnValue(48);

            const { result } = renderHook(() => useMaxTabs());

            expect(result.current).toBe(8);
        });

        test("zero width, should return 1", ()=>{
            mockedUseViewportRem.mockReturnValue(0);

            const { result } = renderHook(() => useMaxTabs());

            expect(result.current).toBe(1);
        });
    });

    describe("Client width tests, element ref provided", () => {
        const ref: RefObject<HTMLElement | null> = {
            current: null,
        };


        beforeEach(()=>{
            mockedUseViewportRem.mockReturnValue(96);
            ref.current = null;
        });

        afterEach(()=>{
            jest.clearAllMocks()
        });

        test("Ref provided but current is set to null, should use viewport width", () => {
            mockedUseElementRem.mockReturnValue(0);

            const { result } = renderHook(() => useMaxTabs(ref));

            expect(result.current).toBe(17);
        });

        test("Ref provided, small container", () => {
            ref.current = document.createElement("div");

            mockedUseElementRem.mockReturnValue(20);

            const { result } = renderHook(() => useMaxTabs(ref));

            expect(result.current).toBe(2);
        });

        test("Ref provided, medium container", () => {
            ref.current = document.createElement("div");

            mockedUseElementRem.mockReturnValue(50);

            const { result } = renderHook(() => useMaxTabs(ref));

            expect(result.current).toBe(8);
        });

        test("Ref provided, zero width container", () => {
            ref.current = document.createElement("div");

            mockedUseElementRem.mockReturnValue(0);

            const { result } = renderHook(() => useMaxTabs(ref));

            expect(result.current).toBe(1);
        });

        test("Ref provided, container width larger than viewport", () => {
            ref.current = document.createElement("div");

            mockedUseElementRem.mockReturnValue(175);

            const { result } = renderHook(() => useMaxTabs(ref));

            expect(result.current).toBe(32);
        });
    });
});