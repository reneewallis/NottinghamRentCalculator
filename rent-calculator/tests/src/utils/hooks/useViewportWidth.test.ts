import { useViewportWidthRem } from "@/src/utils/hooks/useViewportWidth";
import {
    describe,
    expect,
    jest,
    test,
    beforeEach,
    afterEach,
} from "@jest/globals";
import { renderHook, act } from "@testing-library/react";

describe("useViewPortRem tests", () => {
    let resizeCallback: ResizeObserverCallback;

    class ResizeObserverMock {
        constructor(cb: ResizeObserverCallback) {
            resizeCallback = cb;
        }
        observe = jest.fn();
        disconnect = jest.fn();
    }

    let width: number;
    let fontSpy: jest.SpiedFunction<typeof getComputedStyle>;

    beforeEach(() => {
        width = 1536;

        global.ResizeObserver =
            ResizeObserverMock as unknown as typeof ResizeObserver;

        Object.defineProperty(document.documentElement, "clientWidth", {
            configurable: true,
            get: () => width,
        });

        fontSpy = jest.spyOn(window, "getComputedStyle").mockReturnValue({
            fontSize: "16px",
        } as CSSStyleDeclaration);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test.each([
        [1536, 96],
        [160, 10],
        [476, 29.75],
        [10, 0.625],
    ])("calculates viewport width in rem", (widthPx, expected) => {
        width = widthPx;
        const { result } = renderHook(() => useViewportWidthRem());

        expect(result.current).toBe(expected);
    });

    test.each([
        [356.8, 22.3],
        [1240.75, 77.546875],
        [56.754, 3.547125],
        [5.8, 0.3625],
    ])("calculates viewport width with float width", (widthPx, expected) => {
        width = widthPx;
        const { result } = renderHook(() => useViewportWidthRem());

        expect(result.current).toBeCloseTo(expected);
    });

    test.each([
        [8, 350, 43.75],
        [8, 160, 20],
        [12, 1536, 128],
        [12, 60, 5],
        [32, 512, 16],
        [32, 160, 5],
    ])(
        "Correctly uses font size to calculate width in rem, fontSize %d, widthpx %d, expected %d",
        (fontSize, widthPx, widthRem) => {
            fontSpy = fontSpy.mockReturnValue({
                fontSize: `${fontSize}px`,
            } as CSSStyleDeclaration);

            width = widthPx;

            const { result } = renderHook(() => useViewportWidthRem());

            expect(result.current).toBe(widthRem);
        },
    );

    test("updates width when resize happens", () => {
        width = 964;
        const { result } = renderHook(() => useViewportWidthRem());

        expect(result.current).toBe(60.25);

        width = 400;

        act(() => {
            resizeCallback([], {} as ResizeObserver);
        });

        expect(result.current).toBe(25);
    });
});
