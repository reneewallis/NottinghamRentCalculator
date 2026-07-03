"use client";

import { TabsActions } from "@/src/types/Tabs";
import { useTabsContext } from "@/src/utils/Tabs/TabsContext";

function Home() {
    const { tabsState, tabsDispatch: dispatch } = useTabsContext();
    const isHidden = tabsState.wrappedTabArr.length > 0;
    return (
        <div hidden={isHidden} className="
          my-2 flex flex-1 items-center justify-center
        ">
            <div className="
              inline-flex flex-col items-center rounded-2xl border-3
              border-solid border-gray-200 bg-gray-800 p-2 ring-2
              inset-shadow-sm ring-gray-100/60
              md:p-6
              lg:p-10
            ">
                <h1 className="
                  pt-4 text-center text-xl font-semibold text-gray-50
                  text-shadow-lg/20
                  md:text-2xl md:whitespace-nowrap
                  lg:pt-8 lg:text-4xl
                ">
                    Welcome to Nottingham&#39;s Rent Calculator
                </h1>
                <button
                    key={"startNewTabButton"}
                    onClick={() => {
                        dispatch({ type: TabsActions.NEW_TAB });
                    }}
                    className="
                      mt-5 mb-4 cursor-pointer rounded-full border-2
                      border-gray-50 bg-gray-700 p-2 text-center text-xs
                      text-gray-50 shadow-xl transition-colors duration-200
                      text-shadow-lg/20
                      hover:border-fuchsia-700 hover:text-fuchsia-700
                      focus:outline-none
                      md:mt-6 md:p-3 md:text-sm
                      lg:mt-10 lg:mb-6 lg:p-5 lg:text-xl
                    "
                >
                    Create New Tab
                </button>
            </div>
        </div>
    );
}

export default Home;
