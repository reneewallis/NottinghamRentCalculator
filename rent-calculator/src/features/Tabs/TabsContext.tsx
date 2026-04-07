"use client";

import React, { createContext, useContext, useReducer } from "react";
import { tabsReducer } from "./TabsReducer";
import { TabsContextType, TabsProviderProps } from "@/src/Types/Tabs";

const TabsContext = createContext<TabsContextType | null>(null);

function TabsProvider({ children }: TabsProviderProps) {
  const [tabs, dispatch] = useReducer(tabsReducer, {
    nextTabID: 0,
    activeTabIndex: 0,
    showHistory: false,
    viewableIndex: 0,
    hoverLast: false,
    lastTabActive: false,
    wrappedTabArr: [],
  });

  return (
    <TabsContext.Provider value={{ tabsState: tabs, tabsDispatch: dispatch }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (context === null) {
    throw new Error("Tabs Context was null\n");
  }

  return context;
}

export default TabsProvider;
