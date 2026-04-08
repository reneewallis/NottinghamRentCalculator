"use client";

import { useTabsContext } from "@/src/utils/Tabs/TabsContext";
import { TabsActions } from "@/src/types/Tabs";
import React from "react";

function Home() {
    const { tabsState, tabsDispatch: dispatch } = useTabsContext();

    if (tabsState.wrappedTabArr.length === 0) {
        return (
            <div className="flex flex-col items-center mt-20 mx-auto w-fit h-fit p-10 bg-gray-800 border-solid border-gray-200 border-3 inset-shadow-sm ring-2 ring-gray-100/60 rounded-2xl">
                <h1 className="font-bold text-center whitespace-nowrap text-4xl text-gray-50 text-shadow-lg/20 pt-10">
                    Welcome to Nottigham&#39;s Rent Calculator
                </h1>
                <button
                    key={"startNewTabButton"}
                    onClick={() => {
                        dispatch({ type: TabsActions.NEW_TAB });
                    }}
                    className="bg-gray-700 border-gray-50 text-gray-50 text-shadow-lg/20 text-xl border-2 inset-shadow-sm shadow-xl text-center mt-12 mb-12 p-6 rounded-full focus:outline-none transition-colors cursor-pointer duration-200 hover:text-fuchsia-700 hover:border-fuchsia-700"
                >
                    Create New Tab
                </button>
            </div>
        );
    }
}

export default Home;
