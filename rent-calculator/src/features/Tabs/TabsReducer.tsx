import { TabsAction, TabsActions, TabsState } from "../../Types/Tabs";
import dayjs from "dayjs";
import {
  initCalculatorState,
  rentCalculatorReducer,
} from "../RentCalculator/RentCalculatorReducer";

const MAX_TABS: number = 15;

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

      const viewableIndex =
        state.wrappedTabArr.length >= MAX_TABS ? state.viewableIndex + 1 : 0;

      return {
        nextTabID: state.nextTabID + 1,
        activeTabIndex: state.wrappedTabArr.length,
        showHistory: state.showHistory,
        viewableIndex: viewableIndex,
        hoverLast: state.hoverLast,
        lastTabActive: true,
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
      let viewableIndex = state.viewableIndex;
      let showHistory = state.showHistory;
      const newTabArr = state.wrappedTabArr.filter(
        (_, index) => index !== action.closeIndex,
      );

      if (activeTab !== 0 && action.closeIndex <= activeTab) {
        activeTab -= 1;
      }

      if (activeTab === newTabArr.length - 1) {
        lastTabActive = true;
      }

      if (viewableIndex >= 1) {
        if (showHistory && viewableIndex == 1) {
          showHistory = false;
        }

        viewableIndex -= 1;
      }

      return {
        nextTabID: state.nextTabID,
        activeTabIndex: activeTab,
        showHistory: showHistory,
        viewableIndex: viewableIndex,
        hoverLast: state.hoverLast,
        lastTabActive: lastTabActive,
        wrappedTabArr: newTabArr,
      };
    }

    case TabsActions.CLOSE_ALL_TABS: {
      return {
        nextTabID: state.nextTabID,
        activeTabIndex: 0,
        showHistory: false,
        viewableIndex: 0,
        hoverLast: false,
        lastTabActive: false,
        wrappedTabArr: [],
      };
    }

    case TabsActions.HOVER_LAST: {
      return {
        nextTabID: state.nextTabID,
        activeTabIndex: state.activeTabIndex,
        showHistory: state.showHistory,
        viewableIndex: state.viewableIndex,
        hoverLast: action.hoverLast,
        lastTabActive: state.lastTabActive,
        wrappedTabArr: [...state.wrappedTabArr],
      };
    }

    case TabsActions.VIEW_HISTORY: {
      let showHistory = state.showHistory;

      if (showHistory) {
        showHistory = false;
      } else if (state.viewableIndex > 0) {
        showHistory = true;
      }

      return {
        nextTabID: state.nextTabID,
        activeTabIndex: state.activeTabIndex,
        showHistory: showHistory,
        viewableIndex: state.viewableIndex,
        hoverLast: state.hoverLast,
        lastTabActive: state.lastTabActive,
        wrappedTabArr: [...state.wrappedTabArr],
      };
    }

    case TabsActions.SET_ACTIVE_TAB: {
      return {
        nextTabID: state.nextTabID,
        activeTabIndex: action.index,
        showHistory: state.showHistory,
        viewableIndex: state.viewableIndex,
        hoverLast: state.hoverLast,
        lastTabActive: state.lastTabActive,
        wrappedTabArr: [...state.wrappedTabArr],
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
  }
}
