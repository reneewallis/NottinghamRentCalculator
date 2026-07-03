"use client";

import { createContext, use, useEffect, useReducer } from "react";

import { SerialisedTabsTabWrapper } from "@/src/types/Storage";
import { TabsActions, TabsContextType, TabsMetadata, TabsProviderProps } from "@/src/types/Tabs";

import { getSessionStorageItem, setSessionStorageItem } from "../SessionStorage/sessionStorage";
import { tabsReducer } from "./tabsReducer";

const TabsContext = createContext<TabsContextType | null>(null);

const initialTabsValue = {
    nextTabID: 0,
    activeTabIndex: 0,
    showHistory: false,
    hoverLast: false,
    lastTabActive: false,
    hydrated: false,
    wrappedTabArr: [],
};

function TabsProvider({ children }: TabsProviderProps) {
    const [tabsState, dispatch] = useReducer(tabsReducer, initialTabsValue);

    useEffect(() => {
        const metadata = getSessionStorageItem<TabsMetadata>("tabsMetadata");
        const storedTabs = getSessionStorageItem<SerialisedTabsTabWrapper[]>("tabs");

        if (metadata && storedTabs) {
            dispatch({
                type: TabsActions.LOAD_TABS,
                metadata: metadata,
                storedTabs: storedTabs,
            });
        } else {
            dispatch({
                type: TabsActions.LOAD_TABS,
                metadata: initialTabsValue,
                storedTabs: [],
            });
        }
    }, []);

    useEffect(() => {
        setSessionStorageItem<TabsMetadata>("tabsMetadata", {
            activeTabIndex: tabsState.activeTabIndex,
            hoverLast: tabsState.hoverLast,
            lastTabActive: tabsState.lastTabActive,
            nextTabID: tabsState.nextTabID,
            showHistory: tabsState.showHistory,
            hydrated: tabsState.hydrated,
        });
    }, [
        tabsState.activeTabIndex,
        tabsState.hoverLast,
        tabsState.lastTabActive,
        tabsState.nextTabID,
        tabsState.showHistory,
        tabsState.hydrated,
    ]);

    useEffect(() => {
        setSessionStorageItem<SerialisedTabsTabWrapper[]>(
            "tabs",
            tabsState.wrappedTabArr.map((tab) => {
                return {
                    ...tab,
                    calculatorState: {
                        ...tab.calculatorState,
                        minStartDate: tab.calculatorState.minStartDate.toISOString(),
                        minForecastDate: tab.calculatorState.minForecastDate.toISOString(),
                        startDate: tab.calculatorState.startDate
                            ? tab.calculatorState.startDate.toISOString()
                            : null,
                        forecastDate: tab.calculatorState.forecastDate
                            ? tab.calculatorState.forecastDate.toISOString()
                            : null,
                    },
                };
            }),
        );
    }, [tabsState.wrappedTabArr]);

    return (
        <TabsContext value={{ tabsState: tabsState, tabsDispatch: dispatch }}>
            {tabsState.hydrated ? children : null}
        </TabsContext>
    );
}

export function useTabsContext() {
    const context = use(TabsContext);

    if (context === null) {
        throw new Error("Tabs Context was null\n");
    }

    return context;
}

export default TabsProvider;
