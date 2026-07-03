import { afterEach, beforeEach, describe, expect,jest, test } from "@jest/globals";
import { act,renderHook } from "@testing-library/react";

import { useElementWidthRem } from "@/src/utils/hooks/useElementWidth";

describe("useElementWidthRem tests", () => {
    let resizeCallback: ResizeObserverCallback;

    class ResizeObserverMock {
        constructor(cb: ResizeObserverCallback) {
            resizeCallback = cb;
        }
        observe = jest.fn();
        disconnect = jest.fn();
    }

    let fontSpy: jest.SpiedFunction<typeof getComputedStyle>;

    beforeEach(() => {
        global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
        fontSpy = jest.spyOn(window, "getComputedStyle").mockReturnValue({
            fontSize: "16px",
        } as CSSStyleDeclaration);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("has ref and width properties", () => {
        const { result } = renderHook(() => useElementWidthRem());
        expect(result.current).toHaveProperty("ref");
        expect(result.current).toHaveProperty("width");
    });

    test("ref is unused, width should be 0", () => {
        const { result } = renderHook(() => useElementWidthRem());

        expect(result.current.width).toBe(0);
    });

    test("ref is used, should return correct width", () => {
        const width = 380;
        const div = document.createElement("div");

        Object.defineProperty(div, "scrollWidth", {
            configurable: true,
            value: width,
        });

        const { result } = renderHook(() => useElementWidthRem());

        const ref = result.current.ref;

        act(() => {
            ref(div);
        });

        expect(result.current).toEqual({ width: width / 16, ref: ref });
    });

    test.each([
        [512, 32],
        [16, 1],
        [8, 0.5],
        [172, 10.75],
    ])("Calculates element width in rem, testing %dpx, expected %drem", (widthPx, widthRem) => {
        const div = document.createElement("div");

        Object.defineProperty(div, "scrollWidth", {
            configurable: true,
            value: widthPx,
        });

        const { result } = renderHook(() => useElementWidthRem());

        const ref = result.current.ref;

        act(() => {
            ref(div);
        });

        expect(result.current).toEqual({ width: widthRem, ref: ref });
    });

    test.each([
        [173.4, 10.8375],
        [50.675, 3.1671875],
        [8.72, 0.545],
    ])(
        "Calculates element width in rem, decimalPx testing %dpx, expected %drem",
        (widthPx, widthRem) => {
            const div = document.createElement("div");

            Object.defineProperty(div, "scrollWidth", {
                configurable: true,
                value: widthPx,
            });

            const { result } = renderHook(() => useElementWidthRem());

            const ref = result.current.ref;

            act(() => {
                ref(div);
            });

            expect(result.current).toEqual({ ref: ref, width: widthRem });
        },
    );

    test.each([
        [14, 350, 25],
        [14, 952, 68],
        [12, 1536, 128],
        [12, 60, 5],
        [8, 512, 64],
        [8, 16, 2],
        [32, 1536, 48],
        [32, 16, 0.5],
    ])(
        "Correctly uses font size to calculate width in rem, fontSize %d, widthpx %d, expected %d",
        (fontSize, widthPx, widthRem) => {
            const div = document.createElement("div");

            fontSpy = fontSpy.mockReturnValue({
                fontSize: `${fontSize}px`,
            } as CSSStyleDeclaration);

            Object.defineProperty(div, "scrollWidth", {
                configurable: true,
                value: widthPx,
            });

            const { result } = renderHook(() => useElementWidthRem());
            const ref = result.current.ref;

            act(() => {
                ref(div);
            });

            expect(result.current).toEqual({ ref: ref, width: widthRem });
        },
    );

    test("Calculates width after resize", () => {
        const div = document.createElement("div");
        let width = 480;

        Object.defineProperty(div, "scrollWidth", {
            configurable: true,
            get: () => width,
        });

        const { result } = renderHook(() => useElementWidthRem());

        const ref = result.current.ref;

        act(() => {
            ref(div);
        });

        expect(result.current).toEqual({ width: 30, ref: ref });

        width = 570;

        act(() => {
            resizeCallback([], {} as ResizeObserver);
        });

        expect(result.current).toEqual({ width: 35.625, ref: ref });
    });
});
