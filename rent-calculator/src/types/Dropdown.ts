export type DropdownItem<TLabel extends string | number> = {
    id?: string;
    label: TLabel;
    onClick?: () => void;
};

type CommonDropdownBoxProps<TLabel extends string> = {
    label: TLabel;
    items: DropdownItem<TLabel>[];
    small?: boolean;
    minWidth?: number;
    valid?: boolean;
    screenSize?: "SMALL" | "MEDIUM" | "LARGE";
};

type CalcDropdownWidthCommonArgs = {
    maxLabelLength: number;
    screenSize?: "LARGE" | "MEDIUM" | "SMALL";
};

type CalcDropdownWidthDefaultArgs = CalcDropdownWidthCommonArgs & {
    dropdownStyle?: "DEFAULT";
};

type CalcDropdownWidthSmallArgs = CalcDropdownWidthCommonArgs & {
    dropdownStyle: "SMALL";
    longestWordLength: number;
};

export type CalcDropdownWidthArgs = CalcDropdownWidthDefaultArgs | CalcDropdownWidthSmallArgs;

type UncontrolledDropdownBoxProps<TLabel extends string> = CommonDropdownBoxProps<TLabel> & {
    controlled?: false;
};

type ControlledDropdownBoxProps<TLabel extends string> = CommonDropdownBoxProps<TLabel> & {
    controlled: true;
    value: string;
};

export type DropdownBoxProps<TLabel extends string> =
    UncontrolledDropdownBoxProps<TLabel> | ControlledDropdownBoxProps<TLabel>;
