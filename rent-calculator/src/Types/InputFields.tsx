import { ChangeEvent } from "react";
import { Dayjs } from "dayjs"

export type Alignment = "left" | "center" | "right";

type CommonTextBoxProps = {
    label:string;
    text: string;
    alignment?: Alignment;
    width?: number;
    valid?: boolean;
}

export type InputTextBoxProps = CommonTextBoxProps & {
    readOnly: false;
    onChange: (e:ChangeEvent<HTMLTextAreaElement>) => void; 
}

export type ReadOnlyTextBoxProps = CommonTextBoxProps & {
    readOnly: true;
}

export type TextBoxProps = InputTextBoxProps | ReadOnlyTextBoxProps;

type CommonDateBoxProps = {
    label:string;
    alignment?:Alignment;
    minDate?:Dayjs;
    onChange?: (value:Dayjs|null) => void;
    valid?: boolean;
    onError?: (error: string | null, value: Dayjs | null) => void
}

type UncontrolledDateBoxProps = CommonDateBoxProps & {
    controlled?: false;
};

type ControlledDateBoxProps = CommonDateBoxProps & {
    controlled: true;
    value: Dayjs | null;
    setValue: (value:Dayjs|null) => void;
}

export type DateBoxProps = UncontrolledDateBoxProps | ControlledDateBoxProps;
