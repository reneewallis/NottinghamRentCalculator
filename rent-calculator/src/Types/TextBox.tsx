import { ChangeEvent } from "react";

export type InputTextBoxProps = {
    label: string;
    text: string;
    readOnly: false;
    onChange: (e:ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => void; 
}

export type ReadOnlyTextBoxProps = {
    label: string;
    text: string;
    readOnly: true;
}

export type TextBoxProps = InputTextBoxProps | ReadOnlyTextBoxProps;
