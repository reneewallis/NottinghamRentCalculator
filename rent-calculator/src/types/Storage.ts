import { Dayjs } from "dayjs";

import { CalculatorState } from "./RentCalculator";
import { TabsTabWrapper } from "./Tabs";

type SerialisedDayjs<T> = {
    [K in keyof T]: T[K] extends Dayjs ? string : T[K] extends Dayjs | null ? string | null : T[K];
};

type SerialisedCalculatorState = SerialisedDayjs<CalculatorState>;

export type SerialisedTabsTabWrapper = {
    [K in keyof TabsTabWrapper]: TabsTabWrapper[K] extends CalculatorState
        ? SerialisedCalculatorState
        : TabsTabWrapper[K];
};
