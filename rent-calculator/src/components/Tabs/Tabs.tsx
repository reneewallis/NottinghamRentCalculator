"use client";
import React, { useReducer } from "react";
import { TabsActions } from "../../Types/Tabs";
import Tab from "../../components/Tabs/Tab";
import TabPanel from "../../components/Tabs/TabPanel";
import DropdownMenu from "../../components/Buttons/MenuButton";
import HistoryButton from "../Buttons/HistoryButton";
import NewTabButton from "../Buttons/NewTabButton";
import { MenuItems } from "@/src/Types/Buttons";
import { tabsReducer } from "@/src/features/Tabs/TabsReducer";

export default function Tabs() {
  const [tabs, dispatch] = useReducer(tabsReducer, {
    nextTabID: 0,
    activeTab: 0,
    showHistory: false,
    viewableIndex: 0,
    hoverLast: false,
    lastTabActive: false,
    wrappedTabArr: [],
  });

  if (tabs.wrappedTabArr.length === 0) {
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

  return (
    <div className="mt-2 w-full">
      <div className="flex flex-wrap items-center border-b border-gray-800">
        {tabs.wrappedTabArr.map(
          (wrappedTab, index) =>
            (tabs.showHistory || index >= tabs.viewableIndex) && (
              <div
                key={`tabContainer${wrappedTab.id}`}
                onMouseEnter={() => {
                  if (index === tabs.wrappedTabArr.length - 1) {
                    dispatch({ type: TabsActions.HOVER_LAST, hoverLast: true });
                  }
                }}
                onMouseLeave={() => {
                  if (tabs.hoverLast) {
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
                    active={tabs.activeTab === index}
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
          className={`flex items-center mx-0.5 h-7 mt-3 transition-colors duration-100 ${tabs.activeTab === tabs.wrappedTabArr.length - 1 || tabs.hoverLast === true ? "border-gray-500" : "border-l-gray-800 border-l-2"}`}
        >
          <NewTabButton
            onClick={() => {
              dispatch({ type: TabsActions.NEW_TAB });
            }}
          ></NewTabButton>
          <HistoryButton
            showHistory={tabs.showHistory}
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
      {tabs.wrappedTabArr.map((tab, index) => {
        return (
          <div key={`tabChild${tab.id}`} hidden={tabs.activeTab !== index}>
            <TabPanel
              today={tab.today}
              todayString={tab.todayString}
            ></TabPanel>
          </div>
        );
      })}
    </div>
  );
}
