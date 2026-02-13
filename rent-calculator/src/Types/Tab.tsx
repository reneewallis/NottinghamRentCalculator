export type Panel = {
    paragraph: string;
}

export type PanelProps = {
    content:Panel
}

export type Tab = {
    id: number;
    label: string;
    content: Panel;
}