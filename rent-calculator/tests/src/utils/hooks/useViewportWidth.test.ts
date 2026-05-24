import {useViewportWidthRem} from "@/src/utils/hooks/useViewportWidth";
import {describe, expect, jest, test, beforeEach, afterEach} from "@jest/globals";
import { renderHook, act } from "@testing-library/react";

describe("useViewPortRem tests", () =>{
    let resizeCallback: any;

    class ResizeObserverMock {
        constructor(cb: any) {
            resizeCallback = cb;
        }
        observe = jest.fn();
        disconnect = jest.fn();
    }

    let width = 1536;
    beforeEach(() => {
        (global as any).ResizeObserver = ResizeObserverMock;

        Object.defineProperty(document.documentElement, "clientWidth", {
            configurable: true,
            get: () => width,
        });

        jest.spyOn(window, "getComputedStyle").mockReturnValue({
            fontSize: "16px",
        } as CSSStyleDeclaration);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        width = 1536;
    });

    test("calculates viewport width in rem", () => {
    const { result } = renderHook(() => useViewportWidthRem());

    expect(result.current).toBe(96);
    });

    test("updates width when resize happens", () => {
        width = 964;
        const { result } = renderHook(() => useViewportWidthRem());

        expect(result.current).toBeCloseTo(60.25);

        width = 400;

        act(() => {
            resizeCallback();
        });

        expect(result.current).toBe(25);
    });

});