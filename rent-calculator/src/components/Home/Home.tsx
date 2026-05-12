"use client";

import { useTabsContext } from "@/src/utils/Tabs/TabsContext";
import { TabsActions } from "@/src/types/Tabs";
import React from "react";

function Home() {
    const { tabsState, tabsDispatch: dispatch } = useTabsContext();
    const isHidden = tabsState.wrappedTabArr.length > 0;
        return (
            <div hidden={isHidden} className="flex flex-1 items-center justify-center my-2">
                <div  className="inline-flex flex-col items-center p-2 md:p-6 lg:p-10 bg-gray-800 border-solid border-gray-200 border-3 inset-shadow-sm ring-2 ring-gray-100/60 rounded-2xl">
                    <h1 className="font-semibold text-center md:whitespace-nowrap text-xl md:text-2xl lg:text-4xl text-gray-50 text-shadow-lg/20 pt-4 lg:pt-8 ">
                        Welcome to Nottingham&#39;s Rent Calculator
                    </h1>
                    <button
                        key={"startNewTabButton"}
                        onClick={() => {
                            dispatch({ type: TabsActions.NEW_TAB });
                        }}
                        className="bg-gray-700 border-gray-50 text-gray-50 text-shadow-lg/20 text-xs md:text-sm lg:text-xl border-2 shadow-xl text-center mt-5 md:mt-6 lg:mt-10 mb-4 lg:mb-6 p-2 md:p-3 lg:p-5 rounded-full focus:outline-none transition-colors cursor-pointer duration-200 hover:text-fuchsia-700 hover:border-fuchsia-700"
                    >
                        Create New Tab
                    </button>
                </div>
            </div>
        );
}

export default Home;
