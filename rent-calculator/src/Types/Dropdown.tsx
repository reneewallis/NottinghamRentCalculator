export type DropdownItem = {
    label: string;
    onClick?: () => void;
}

export type DropdownProps = {
    items: DropdownItem[];
}

export type DropdownBoxProps = {
    label: string;
    boxText: string;
    items: DropdownItem[];
}