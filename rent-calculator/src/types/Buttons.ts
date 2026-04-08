import { DropdownItem } from "./Dropdown";

export type NewTabButtonProps = {
    onClick: () => void;
};

export type HistoryButtonProps = {
    showHistory: boolean;
    onClick: () => void;
};

type ArrowDirection = "left" | "right";

export type ArrowButtonProps = {
    direction: ArrowDirection;
    onClick: () => void;
};

export enum MenuItems {
    CLOSE_ALL_TABS = "Close All Tabs",
}

type MenuButtonLabelType = (typeof MenuItems)[keyof typeof MenuItems];

type DropdownButtonProps<TLabel extends string | number> = {
    items: DropdownItem<TLabel>[];
};

export type MenuButtonProps = DropdownButtonProps<MenuButtonLabelType>;
