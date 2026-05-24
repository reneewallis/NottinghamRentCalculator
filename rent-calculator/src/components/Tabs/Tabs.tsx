"use client";

import { TabsActions } from "../../types/Tabs";
import Tab from "../../components/Tabs/Tab";
import DropdownMenu from "../../components/Buttons/MenuButton";
import HistoryButton from "../Buttons/HistoryButton";
import NewTabButton from "../Buttons/NewTabButton";
import { MenuItems } from "@/src/types/Buttons";
import { useTabsContext } from "@/src/utils/Tabs/TabsContext";
import { TAB_BUTTONS_CONTAINER_MARGIN_X } from "./tabConsts";
import { useMaxTabs } from "@/src/utils/hooks/useMaxTabs";

export default function Tabs() {
    const { tabsState, tabsDispatch: dispatch } = useTabsContext();
    const maxTabs = useMaxTabs();
    const viewableIndex = tabsState.wrappedTabArr.length > maxTabs? tabsState.wrappedTabArr.length - maxTabs: 0;

    return (
        <div className="mt-2 w-full">
            <div className="flex flex-wrap items-center border-b border-gray-800">
                {tabsState.wrappedTabArr.map(
                    (wrappedTab, index) =>
                        (tabsState.showHistory ||
                            index >= viewableIndex) && (
                            <div
                                key={`tabContainer${wrappedTab.id}`}
                                onMouseEnter={() => {
                                    if (
                                        index ===
                                        tabsState.wrappedTabArr.length - 1
                                    ) {
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
                                        active={
                                            tabsState.activeTabIndex === index
                                        }
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
                        style={{marginInline: `${TAB_BUTTONS_CONTAINER_MARGIN_X}rem`}}
                        className={`flex items-center h-7 mt-3 ${tabsState.activeTabIndex === tabsState.wrappedTabArr.length - 1 || tabsState.hoverLast === true ? "border-gray-500" : "border-l-gray-800 border-l-2"}`}
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
