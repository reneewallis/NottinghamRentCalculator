export type DropdownItem<TLabel extends string | number> = {
  label: TLabel;
  onClick?: () => void;
};

type CommonDropdownBoxProps<TLabel extends string> = {
  label: TLabel;
  items: DropdownItem<TLabel>[];
  small?: boolean;
  minWidth?: number;
  valid?: boolean;
};

type UncontrolledDropdownBoxProps<TLabel extends string> =
  CommonDropdownBoxProps<TLabel> & { controlled?: false };

type ControlledDropdownBoxProps<TLabel extends string> =
  CommonDropdownBoxProps<TLabel> & { controlled: true; value: string };

export type DropdownBoxProps<TLabel extends string> =
  | UncontrolledDropdownBoxProps<TLabel>
  | ControlledDropdownBoxProps<TLabel>;
