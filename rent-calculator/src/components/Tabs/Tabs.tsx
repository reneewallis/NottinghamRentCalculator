"use client";

import { MenuItems } from "@/src/types/Buttons";
import { useMaxTabs } from "@/src/utils/hooks/useMaxTabs";
import { useTabsContext } from "@/src/utils/Tabs/TabsContext";

import DropdownMenu from "../../components/Buttons/MenuButton";
import Tab from "../../components/Tabs/Tab";
import { TabsActions } from "../../types/Tabs";
import HistoryButton from "../Buttons/HistoryButton";
import NewTabButton from "../Buttons/NewTabButton";
import { TAB_BUTTONS_CONTAINER_MARGIN_X } from "./tabConsts";

export default function Tabs() {
    const { tabsState, tabsDispatch: dispatch } = useTabsContext();
    const { maxTabs, ref: mainContainerRef } = useMaxTabs("element");
    const viewableIndex =
        tabsState.wrappedTabArr.length > maxTabs ? tabsState.wrappedTabArr.length - maxTabs : 0;

    return (
        <div className="mt-2 w-full">
            <div
                ref={mainContainerRef}
                className="flex flex-wrap items-center border-b border-gray-800"
            >
                {tabsState.wrappedTabArr.map(
                    (wrappedTab, index) =>
                        (tabsState.showHistory || index >= viewableIndex) && (
                            <div
                                key={`tabContainer${wrappedTab.id}`}
                                onMouseEnter={() => {
                                    if (index === tabsState.wrappedTabArr.length - 1) {
                                        dispatch({
                                            type: TabsActions.HOVER_LAST,
                                            hoverLast: true,
                                        });
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
                {tabsState.wrappedTabArr.length > 0 && (
                    <div
                        style={{
                            marginInline: `${TAB_BUTTONS_CONTAINER_MARGIN_X}rem`,
                        }}
                        className={`
                          mt-3 flex h-7 items-center
                          ${
                              tabsState.activeTabIndex === tabsState.wrappedTabArr.length - 1 ||
                              tabsState.hoverLast === true
                                  ? `border-gray-500`
                                  : "border-l-2 border-l-gray-800"
                          }
                        `}
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
                                        dispatch({
                                            type: TabsActions.CLOSE_ALL_TABS,
                                        });
                                    },
                                },
                            ]}
                        ></DropdownMenu>
                    </div>
                )}
            </div>
        </div>
    );
}
