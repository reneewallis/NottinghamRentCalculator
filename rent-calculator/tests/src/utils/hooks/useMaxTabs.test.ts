import { describe, expect, jest, test, beforeEach } from "@jest/globals";

jest.mock("@/src/utils/hooks/useViewportWidth", () => {
    const actual = jest.requireActual("@/src/utils/hooks/useViewportWidth") as typeof import("@/src/utils/hooks/useViewportWidth");

    return {
        __esModule: true,
        ...actual,
        useViewportWidthRem: jest.fn(),
    };
});

import { renderHook } from "@testing-library/react";
import { useViewportWidthRem } from "@/src/utils/hooks/useViewportWidth";
import { useMaxTabs } from "@/src/utils/hooks/useMaxTabs";

const mockedUseViewportRem = useViewportWidthRem as jest.Mock;

describe("useMaxTabs tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

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

});