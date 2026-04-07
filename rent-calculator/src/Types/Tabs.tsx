import React from "react";
import { CalculatorAction, CalculatorState } from "./RentCalculator";

export type TabProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
};

export enum TabsActions {
  NEW_TAB,
  CLOSE_TAB,
  CLOSE_ALL_TABS,
  SET_ACTIVE_TAB,
  HOVER_LAST,
  VIEW_HISTORY,
  USE_RENT_CALCULATOR,
}

type TabsActionCloseTab = {
  type: TabsActions.CLOSE_TAB;
  closeIndex: number;
};

type TabsActionHoverLast = {
  type: TabsActions.HOVER_LAST;
  hoverLast: boolean;
};

type TabsActionSetActiveTab = {
  type: TabsActions.SET_ACTIVE_TAB;
  index: number;
};

type TabsActionUseRentCalculator = {
  type: TabsActions.USE_RENT_CALCULATOR;
  action: CalculatorAction;
};

type TabsActionOther = {
  type:
    | TabsActions.CLOSE_ALL_TABS
    | TabsActions.NEW_TAB
    | TabsActions.VIEW_HISTORY;
};

export type TabsAction =
  | TabsActionOther
  | TabsActionHoverLast
  | TabsActionCloseTab
  | TabsActionSetActiveTab
  | TabsActionUseRentCalculator;

export type TabsTabWrapper = {
  id: number;
  time: string;
  calculatorState: CalculatorState;
  todayString: string;
};

export type TabsState = {
  nextTabID: number;
  activeTabIndex: number;
  showHistory: boolean;
  viewableIndex: number;
  hoverLast: boolean;
  lastTabActive: boolean;
  wrappedTabArr: TabsTabWrapper[];
};

export type TabsContextType = {
  tabsState: TabsState;
  tabsDispatch: React.ActionDispatch<[action: TabsAction]>;
};

export type TabsProviderProps = {
  children?: React.ReactNode;
};
