import { getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem } from "@/src/utils/SessionStorage/sessionStorage";
import {describe, expect, jest, test, afterEach} from "@jest/globals";

describe("getSessionStorageItem tests",()=>{
    afterEach(()=>{
        jest.restoreAllMocks();
    });
    test("get item, item found",()=>{
        const returnArr = {test:0};
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(JSON.stringify(returnArr));
        expect(getSessionStorageItem("test")).toEqual(returnArr);
    });
    test("get item, item not found",()=>{
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
        expect(getSessionStorageItem("test")).toEqual(null);
    });
});

describe("setSessionStorageItem tests", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should store on session storage", () => {
        const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

        const value = { test: "test", value: 0 };

        setSessionStorageItem("test", value);

        expect(setItemSpy).toHaveBeenCalledWith(
            "test",
            JSON.stringify(value)
        );
    });

    test("errors print to console", () => {
        const error = new Error("Storage full");

        jest.spyOn(Storage.prototype, "setItem")
            .mockImplementation(() => {
                throw error;
            });

        const consoleSpy = jest
            .spyOn(console, "log")
            .mockImplementation(() => {});

        setSessionStorageItem("user", { test: "test" });

        expect(consoleSpy).toHaveBeenCalledWith(error);
    });
});

describe("removeSessionStorageItem", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("calls sessionStorage.removeItem with the correct key", () => {
        const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

        removeSessionStorageItem("test");

        expect(removeItemSpy).toHaveBeenCalledWith("test");
    });
});