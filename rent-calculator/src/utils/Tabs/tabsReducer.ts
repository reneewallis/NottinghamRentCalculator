import { TabsAction, TabsActions, TabsState } from "../../types/Tabs";
import dayjs from "dayjs";
import {
    initCalculatorState,
    rentCalculatorReducer,
} from "../RentCalculator/rentCalculatorReducer";

export function tabsReducer(state: TabsState, action: TabsAction): TabsState {
    switch (action.type) {
        case TabsActions.NEW_TAB: {
            const now = dayjs();
            const hours = now.hour().toString().padStart(2, "0");
            const minutes = now.minute().toString().padStart(2, "0");
            const time = `${hours}:${minutes}`;
            const dd = now.date().toString().padStart(2, "0");
            const mm = (now.month() + 1).toString().padStart(2, "0");
            const yyyy = now.year().toString().padStart(4, "0");
            const todayString = `${dd}/${mm}/${yyyy}`;

            return {
                nextTabID: state.nextTabID + 1,
                activeTabIndex: state.wrappedTabArr.length,
                showHistory: state.showHistory,
                hoverLast: state.hoverLast,
                lastTabActive: true,
                hydrated: state.hydrated,
                wrappedTabArr: [
                    ...state.wrappedTabArr,
                    {
                        id: state.nextTabID,
                        time: time,
                        calculatorState: initCalculatorState(now),
                        todayString: todayString,
                    },
                ],
            };
        }

        case TabsActions.CLOSE_TAB: {
            let activeTab = state.activeTabIndex;
            let lastTabActive = state.lastTabActive;
            const showHistory = state.showHistory;
            const newTabArr = state.wrappedTabArr.filter(
                (_, index) => index !== action.closeIndex,
            );

            if (activeTab !== 0 && action.closeIndex <= activeTab) {
                activeTab -= 1;
            }

            if (activeTab === newTabArr.length - 1) {
                lastTabActive = true;
            }

            return {
                ...state,
                activeTabIndex: activeTab,
                showHistory: showHistory,
                lastTabActive: lastTabActive,
                wrappedTabArr: newTabArr,
            };
        }

        case TabsActions.CLOSE_ALL_TABS: {
            return {
                nextTabID: state.nextTabID,
                activeTabIndex: 0,
                showHistory: false,
                hoverLast: false,
                lastTabActive: false,
                hydrated: state.hydrated,
                wrappedTabArr: [],
            };
        }

        case TabsActions.HOVER_LAST: {
            return {
                ...state,
                hoverLast: action.hoverLast,
            };
        }

        case TabsActions.VIEW_HISTORY: {
            return {
                ...state,
                showHistory: !state.showHistory,
            };
        }

        case TabsActions.SET_ACTIVE_TAB: {
            return {
                ...state,
                activeTabIndex: action.index,
            };
        }

        case TabsActions.USE_RENT_CALCULATOR: {
            return {
                ...state,
                wrappedTabArr: state.wrappedTabArr.map((tab, index) =>
                    index === state.activeTabIndex
                        ? {
                              ...tab,
                              calculatorState: rentCalculatorReducer(
                                  tab.calculatorState,
                                  action.action,
                              ),
                          }
                        : tab,
                ),
            };
        }

        case TabsActions.LOAD_TABS: {
            return {
                ...state,
                ...action.metadata,
                hydrated: true,
                wrappedTabArr: action.storedTabs.map((tab) => {
                    return {
                        ...tab,
                        calculatorState: {
                            ...tab.calculatorState,
                            minStartDate: dayjs(
                                tab.calculatorState.minStartDate,
                            ),
                            minForecastDate: dayjs(
                                tab.calculatorState.minForecastDate,
                            ),
                            startDate: tab.calculatorState.startDate
                                ? dayjs(tab.calculatorState.startDate)
                                : null,
                            forecastDate: tab.calculatorState.forecastDate
                                ? dayjs(tab.calculatorState.forecastDate)
                                : null,
                        },
                    };
                }),
            };
        }
    }
}
