import { useElementWidthRem } from "@/src/utils/hooks/useElementWidth";
import { jest, describe, test, beforeEach, afterEach, expect } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { RefObject } from "react";

describe("useElementWidthRem tests", ()=>{
    let resizeCallback: any;

    class ResizeObserverMock {
        constructor(cb: any) {
            resizeCallback = cb;
        }
        observe = jest.fn();
        disconnect = jest.fn();
    }

    const ref: RefObject<HTMLElement | null> = {
        current: null,
    };

    let fontSpy: jest.SpiedFunction<typeof getComputedStyle>;

    beforeEach(() => {
        (global as any).ResizeObserver = ResizeObserverMock;
        ref.current = null;
        fontSpy = jest.spyOn(window, "getComputedStyle").mockReturnValue({
                fontSize: "16px"
            } as CSSStyleDeclaration
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("ref is not provided, should return 0", ()=>{
        const { result } = renderHook(() => useElementWidthRem());

        expect(result.current).toBe(0);
    });

    test("ref provided but current is null, should return 0", ()=>{
        const { result } = renderHook(() => useElementWidthRem(ref));

        expect(result.current).toBe(0);
    });

    test.each([[512, 32], [16, 1], [8, 0.5], [172, 10.75]])("Calculates element width in rem, testing %dpx, expected %drem", (widthPx, widthRem)=>{
        const div = document.createElement("div");

        Object.defineProperty(div, "offsetWidth", {
            configurable: true,
            value: widthPx,
        });

        ref.current = div;

        const { result } = renderHook(() => useElementWidthRem(ref));

        expect(result.current).toBe(widthRem);
    });

    test.each([[173.4, 10.8375], [50.675, 3.1671875], [8.72, 0.545]])("Calculates element width in rem, decimalPx testing %dpx, expected %drem", (widthPx, widthRem)=>{
        const div = document.createElement("div");

        Object.defineProperty(div, "offsetWidth", {
            configurable: true,
            value: widthPx,
        });

        ref.current = div;

        const { result } = renderHook(() => useElementWidthRem(ref));

        expect(result.current).toBeCloseTo(widthRem);
    });

    test.each([[14, 350, 25], [14, 952, 68], [12, 1536, 128], [12, 60, 5],
    [8, 512, 64], [8, 16 ,2], [32, 1536, 48], [32, 16, 0.5]])("Correctly uses font size to calculate width in rem, fontSize %d, widthpx %d, expected %d", (fontSize, widthPx, widthRem)=>{
        const div = document.createElement("div");

        fontSpy = fontSpy.mockReturnValue({
            fontSize: `${fontSize}px`,
        } as CSSStyleDeclaration);

        Object.defineProperty(div, "offsetWidth", {
            configurable: true,
            value: widthPx,
        });

        ref.current = div;

        const { result } = renderHook(() => useElementWidthRem(ref));

        expect(result.current).toBe(widthRem);
    });

    test("Calculates width after resize", ()=>{
        const div = document.createElement("div");
        let width = 480;

        Object.defineProperty(div, "offsetWidth", {
            configurable: true,
            get: () => width,
        });

        ref.current = div;

        const { result } = renderHook(() => useElementWidthRem(ref));

        expect(result.current).toBe(30);

        width = 570;

        act(() => {
            resizeCallback();
        });

        expect(result.current).toBe(35.625);

    });
});