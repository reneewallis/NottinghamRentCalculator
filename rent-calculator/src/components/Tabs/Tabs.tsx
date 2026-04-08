"use client";
import React from "react";
import { TabsActions } from "../../types/Tabs";
import Tab from "../../components/Tabs/Tab";
import DropdownMenu from "../../components/Buttons/MenuButton";
import HistoryButton from "../Buttons/HistoryButton";
import NewTabButton from "../Buttons/NewTabButton";
import { MenuItems } from "@/src/types/Buttons";
import { useTabsContext } from "@/src/features/Tabs/TabsContext";

export default function Tabs() {
  const { tabsState, tabsDispatch: dispatch } = useTabsContext();
  return (
    <div className="mt-2 w-full">
      <div className="flex flex-wrap items-center border-b border-gray-800">
        {tabsState.wrappedTabArr.map(
          (wrappedTab, index) =>
            (tabsState.showHistory || index >= tabsState.viewableIndex) && (
              <div
                key={`tabContainer${wrappedTab.id}`}
                onMouseEnter={() => {
                  if (index === tabsState.wrappedTabArr.length - 1) {
                    dispatch({ type: TabsActions.HOVER_LAST, hoverLast: true });
                  }
                }}
                onMouseLeave={() => {
                  if (tabsState.hoverLast) {
                    dispatch({
                      type: TabsActions.HOVER_LAST,
                      hoverLast: false,
                    });
                  }
                }}
              >
                {
                  <Tab
                    key={`tab${wrappedTab.id}`}
                    label={wrappedTab.time}
                    active={tabsState.activeTabIndex === index}
                    onClick={() => {
                      dispatch({
                        type: TabsActions.SET_ACTIVE_TAB,
                        index: index,
                      });
                    }}
                    onClose={() =>
                      dispatch({
                        type: TabsActions.CLOSE_TAB,
                        closeIndex: index,
                      })
                    }
                  ></Tab>
                }
              </div>
            ),
        )}
        <div
          className={`flex items-center mx-0.5 h-7 mt-3 transition-colors duration-100 ${tabsState.activeTabIndex === tabsState.wrappedTabArr.length - 1 || tabsState.hoverLast === true ? "border-gray-500" : "border-l-gray-800 border-l-2"}`}
        >
          <NewTabButton
            onClick={() => {
              dispatch({ type: TabsActions.NEW_TAB });
            }}
          ></NewTabButton>
          <HistoryButton
            showHistory={tabsState.showHistory}
            onClick={() => {
              dispatch({ type: TabsActions.VIEW_HISTORY });
            }}
          ></HistoryButton>
          <DropdownMenu
            items={[
              {
                label: MenuItems.CLOSE_ALL_TABS,
                onClick: () => {
                  dispatch({ type: TabsActions.CLOSE_ALL_TABS });
                },
              },
            ]}
          ></DropdownMenu>
        </div>
      </div>
    </div>
  );
}
