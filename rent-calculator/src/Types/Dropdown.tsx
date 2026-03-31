export type DropdownItem<TLabel extends string | number> = {
  label: TLabel;
  onClick?: () => void;
};

export type DropdownBoxProps<TLabel extends string> = {
  label: TLabel;
  items: DropdownItem<TLabel>[];
  small?: boolean;
  minWidth?: number;
  valid?: boolean;
};
