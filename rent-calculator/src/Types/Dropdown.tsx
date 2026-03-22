export type DropdownItem = {
  label: string;
  onClick?: () => void;
};

export type DropdownProps = {
  items: DropdownItem[];
};

export type DropdownBoxProps = {
  label: string;
  items: DropdownItem[];
  small?: boolean;
  minWidth?: number;
  valid?: boolean;
};
