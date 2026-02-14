export type DropdownItem = {
    label: string;
    onClick: (label?:string) => void;
}

export type DropdownProps = {
    items: DropdownItem[]
}