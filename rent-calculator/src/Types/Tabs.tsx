import { Dayjs } from "dayjs";
import React from "react";

export type PanelProps = {
  today: Dayjs;
  todayString: string;
};

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
  | TabsActionSetActiveTab;

export type TabsTabWrapper = {
  id: number;
  time: string;
  today: Dayjs;
  todayString: string;
};

export type TabsState = {
  nextTabID: number;
  activeTab: number;
  showHistory: boolean;
  viewableIndex: number;
  hoverLast: boolean;
  lastTabActive: boolean;
  wrappedTabArr: TabsTabWrapper[];
};
