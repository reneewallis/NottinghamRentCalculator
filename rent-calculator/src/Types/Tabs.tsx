import React from "react";

export type Panel = {
    paragraph: string;
}

export type PanelProps = {
    content:Panel;
}

export type TabProps = {
    label: string;
    active?: boolean;
    onClick?: () => void;
    onClose?: () => void;
    children?: React.ReactNode;
}

export enum TabsActions {
    NEW_TAB,
    CLOSE_TAB,
    CLOSE_ALL_TABS,
    SET_ACTIVE_TAB,
    HOVER_LAST,
    VIEW_HISTORY
}

type TabsActionCloseTab = {
    type: TabsActions.CLOSE_TAB;
    closeIndex: number;
}

type TabsActionHoverLast = {
    type: TabsActions.HOVER_LAST;
    hoverLast: boolean;
}

type TabsActionSetActiveTab = {
    type: TabsActions.SET_ACTIVE_TAB;
    index: number;
}

type TabsActionOther = {
    type: TabsActions.CLOSE_ALL_TABS | TabsActions.NEW_TAB | TabsActions.VIEW_HISTORY;
}

export type TabsAction = TabsActionOther | TabsActionHoverLast | TabsActionCloseTab | TabsActionSetActiveTab;

type TabsChildWrapperTab = {
    isTab: true;
    id: number;
    node: React.ReactElement<TabProps>;
}

type TabsChildWrapperNonTab = {
    isTab: false;
    id: number;
    node: React.ReactNode;
}

export type TabsChildrenWrapper = TabsChildWrapperTab | TabsChildWrapperNonTab;

export type TabsState = {
    nextTabID:number;
    activeTab:number;
    showHistory: boolean;
    viewableIndex: number;
    hoverLast: boolean;
    lastTabActive: boolean;
    children: TabsChildrenWrapper[];
}

export type TabsProps = {
    children?: React.ReactNode;
}