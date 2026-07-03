import { Dayjs } from "dayjs";
import Decimal from "decimal.js";

import {
    BenefitType,
    ForecastState,
    InstallmentFrequency,
    RentFrequency,
    RentState,
    ShortfallState,
} from "@/src/types/RentCalculator";

import { TAB_BUTTONS_CONTAINER_WIDTH, TAB_CONTAINER_WIDTH } from "../components/Tabs/tabConsts";

export function getMaxTabs(continerWidthRem: number) {
    return continerWidthRem >= TAB_BUTTONS_CONTAINER_WIDTH + TAB_CONTAINER_WIDTH
        ? Math.floor((continerWidthRem - TAB_BUTTONS_CONTAINER_WIDTH) / TAB_CONTAINER_WIDTH)
        : 1;
}
const CSS_WIDTH_UNITS = [
    // absolute lengths
    "px",
    "pt",
    "pc",
    "in",
    "cm",
    "mm",

    // relative lengths
    "em",
    "rem",
    "ex",
    "ch",

    // viewport units
    "vw",
    "vh",
    "vmin",
    "vmax",

    // container query units
    "cqw",
    "cqh",
    "cqi",
    "cqb",
    "cqmin",
    "cqmax",

    // percentage
    "%",
];

export class UnsupportedUnitError extends Error {
    constructor(unit: string) {
        super(`unit "${unit}" is valid but it is unsupported`);
        this.name = "UnsupportedUnitError";
    }
}

export function calcPx(value: string) {
    const match = value.match(/^([\d.]+)([a-zA-Z%]+)$/);
    if (!match) {
        throw new Error("value was invalid: expected number followed by unit (e.g. 12px, 1.5rem)");
    }

    const [, size, unit] = match;
    const sizeNumber = Number(size);

    if (unit !== "px" && unit !== "rem") {
        if (CSS_WIDTH_UNITS.includes(unit)) {
            throw new UnsupportedUnitError(unit);
        }
        throw new Error(`Invalid unit: ${unit}`);
    }

    if (isNaN(sizeNumber)) {
        throw new Error(`start of value "${size}" was not a valid number`);
    }

    let rootFontSize: number;

    try {
        rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    } catch {
        rootFontSize = 16;
    }

    return unit === "rem" ? sizeNumber * rootFontSize : sizeNumber;
}

export function fluidCSSWidthScale(min: string, pref: string, max: string): string {
    const minScreen = "58rem";
    const devScreen = "96rem";

    try {
        const minPx = calcPx(min);
        const maxPx = calcPx(max);
        const prefPx = calcPx(pref);
        if (minPx > prefPx) {
            throw new Error(`min "${min}" is larger than pref "${pref}"`);
        }
        if (minPx > maxPx) {
            throw new Error(`min "${min}" is larger than max "${max}"`);
        }
        if (prefPx > maxPx) {
            throw new Error(`pref "${pref}" is larger than max "${max}"`);
        }

        const minScreenPx = calcPx(minScreen);
        const devScreenPx = calcPx(devScreen);

        if (minScreenPx > devScreenPx) {
            throw new Error(
                `min screen "${minScreen}" cannot be larger than devScreen "${devScreen}"`,
            );
        }
    } catch (error: unknown) {
        if (!(error instanceof UnsupportedUnitError)) {
            throw error;
        }
    }

    return `clamp(${min}, calc(${min} + (${pref} - ${min}) * ((100vw - ${minScreen}) / (${devScreen} - ${minScreen}))), ${max})`;
}

export function ceil2DP(value: number | Decimal): number {
    const castValue = value instanceof Decimal ? value : new Decimal(value);
    return castValue.toDecimalPlaces(2, Decimal.ROUND_CEIL).toNumber();
}

export function floor2DP(value: number | Decimal): number {
    const castValue = value instanceof Decimal ? value : new Decimal(value);
    return castValue.toDecimalPlaces(2, Decimal.ROUND_FLOOR).toNumber();
}

export function isValidNumberEntry(value: string): boolean {
    const numerical = +value;

    if (isNaN(numerical) || numerical < 0) {
        return false;
    }

    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1) {
        if (value.substring(decimalIndex).length !== 3) {
            return false;
        }
    }

    return true;
}

export function calculateRent(frequency: RentFrequency, value: string): RentState {
    const frequencySelected = frequency !== RentFrequency.UNSELECTED;
    let valueIsValid = true;

    let weekly = "";
    let fourWeekly = "";
    let monthly = "";

    if (value !== "" && isValidNumberEntry(value)) {
        const rentAmount = new Decimal(+value);

        switch (frequency) {
            case RentFrequency.WEEKLY: {
                weekly = rentAmount.toFixed(2);
                fourWeekly = rentAmount.times(4).toFixed(2);
                monthly = ceil2DP(rentAmount.times(52).div(12)).toFixed(2);
                break;
            }

            case RentFrequency.FOUR_WEEKLY: {
                weekly = ceil2DP(rentAmount.div(4)).toFixed(2);
                fourWeekly = rentAmount.toFixed(2);
                monthly = ceil2DP(rentAmount.times(13).div(12)).toFixed(2);
                break;
            }
            case RentFrequency.MONTHLY: {
                weekly = ceil2DP(rentAmount.times(12).div(52)).toFixed(2);
                fourWeekly = ceil2DP(rentAmount.times(12).div(13)).toFixed(2);
                monthly = rentAmount.toFixed(2);
                break;
            }
        }
    } else {
        valueIsValid = value === "" ? true : false;
    }

    return {
        rentFrequency: frequency,
        rentAmount: value,
        rentFrequencyIsValid: value === "" || frequencySelected,
        rentAmountIsValid: valueIsValid,
        weeklyRent: weekly,
        fourWeeklyRent: fourWeekly,
        monthlyRent: monthly,
    };
}

export function calculateShortfall(
    benefitType: BenefitType,
    benefitValue: string,
    weeklyRent: string,
    fourWeeklyRent: string,
    monthlyRent: string,
): ShortfallState {
    const benefitValueIsValid = isValidNumberEntry(benefitValue);
    const benefitTypeIsValid = benefitValue === "" || benefitType !== BenefitType.UNSELECTED;

    let weeklyShortfall = "";
    let fourWeeklyShortfall = "";
    let monthlyShortfall = "";

    if (
        benefitValue !== "" &&
        benefitValueIsValid &&
        weeklyRent !== "" &&
        fourWeeklyRent !== "" &&
        monthlyRent !== ""
    ) {
        const benefitAmount = new Decimal(+benefitValue);
        const weeklyDecimal = new Decimal(+weeklyRent);
        const fourWeeklyDecimal = new Decimal(+fourWeeklyRent);
        const monthlyDecimal = new Decimal(+monthlyRent);

        switch (benefitType) {
            case BenefitType.HOUSING_BENEFIT: {
                weeklyShortfall = floor2DP(benefitAmount.div(4).minus(weeklyDecimal)).toFixed(2);
                fourWeeklyShortfall = benefitAmount.minus(fourWeeklyDecimal).toFixed(2);
                monthlyShortfall = floor2DP(
                    benefitAmount.times(13).div(12).minus(monthlyDecimal),
                ).toFixed(2);

                break;
            }

            case BenefitType.UNIVERSAL_CREDIT: {
                weeklyShortfall = floor2DP(
                    benefitAmount.times(12).div(52).minus(weeklyDecimal),
                ).toFixed(2);
                fourWeeklyShortfall = floor2DP(
                    benefitAmount.times(12).div(13).minus(fourWeeklyDecimal),
                ).toFixed(2);
                monthlyShortfall = benefitAmount.minus(monthlyDecimal).toFixed(2);

                break;
            }
        }
    }

    return {
        benefitType: benefitType,
        benefitAmount: benefitValue,
        benefitTypeIsValid: benefitTypeIsValid,
        benefitAmountIsValid: benefitValueIsValid,
        weeklyShortfall: weeklyShortfall,
        fourWeeklyShortfall: fourWeeklyShortfall,
        monthlyShortfall: monthlyShortfall,
    };
}

export function calculateStartingBalance(
    weeksUntilStartDate: number,
    currentBalance: string,
    weeklyRent: string,
): string {
    if (
        currentBalance === "" ||
        (weeklyRent === "" && weeksUntilStartDate !== 0) ||
        weeksUntilStartDate === -1 ||
        !isValidNumberEntry(currentBalance)
    ) {
        return "";
    }

    const balance = new Decimal(+currentBalance);
    const rent = new Decimal(+weeklyRent);

    return rent.times(weeksUntilStartDate).add(balance).toFixed(2);
}

export function calculateTotalInstallments(startingBalance: string, defaultAmount: string): number {
    if (
        startingBalance === "" ||
        defaultAmount === "" ||
        !isValidNumberEntry(startingBalance) ||
        !isValidNumberEntry(defaultAmount)
    ) {
        return -1;
    }

    const balance = new Decimal(+startingBalance);
    const amount = new Decimal(+defaultAmount);

    return balance.div(amount).ceil().toNumber();
}

export function calculateInstallment(
    startDate: Dayjs,
    forecastDate: Dayjs,
    paymentFrequency: InstallmentFrequency,
): number {
    if (forecastDate.startOf("day").isBefore(startDate.startOf("day"))) {
        return 0;
    }

    let installment = 1;

    switch (paymentFrequency) {
        case InstallmentFrequency.UNSELECTED: {
            return 0;
        }

        case InstallmentFrequency.WEEKLY: {
            installment += forecastDate.startOf("day").diff(startDate.startOf("day"), "weeks");
            break;
        }

        case InstallmentFrequency.MONTHLY: {
            installment += forecastDate.startOf("day").diff(startDate.startOf("day"), "months");
            break;
        }
    }

    return installment;
}

export function calculateForecastDate(
    startDate: Dayjs,
    minForecastDate: Dayjs,
    paymentFrequency: InstallmentFrequency,
    installmentNumber: number,
): Dayjs | null {
    let forecastDate = null;
    switch (paymentFrequency) {
        case InstallmentFrequency.UNSELECTED: {
            return null;
        }

        case InstallmentFrequency.WEEKLY: {
            forecastDate = startDate.startOf("day").add(installmentNumber - 1, "weeks");
            break;
        }

        case InstallmentFrequency.MONTHLY: {
            forecastDate = startDate.startOf("day").add(installmentNumber - 1, "months");
            break;
        }
    }

    return forecastDate.startOf("day").isBefore(minForecastDate.startOf("day"))
        ? minForecastDate
        : forecastDate;
}

export function calculateForecastPaid(
    installmentNumber: number,
    defaultAmount: string,
    startingBalance: string,
): string {
    if (defaultAmount === "" || startingBalance === "" || !isValidNumberEntry(defaultAmount)) {
        return "";
    }

    if (installmentNumber === 0) {
        return "0.00";
    }

    const amount = new Decimal(+defaultAmount);
    const balance = new Decimal(+startingBalance);
    const paid = amount.times(installmentNumber);

    if (paid.greaterThan(balance)) {
        return startingBalance;
    } else {
        return paid.toFixed(2);
    }
}

export function calculateBalanceRemaining(startingBalance: string, totalPaid: string): string {
    if (
        startingBalance === "" ||
        totalPaid === "" ||
        !isValidNumberEntry(startingBalance) ||
        !isValidNumberEntry(totalPaid)
    ) {
        return "";
    }

    const balance = new Decimal(+startingBalance);
    const paid = new Decimal(+totalPaid);

    return balance.minus(paid).toFixed(2);
}

export function calculateForecast(
    startingBalance: string,
    startDate: Dayjs | null,
    startDateIsValid: boolean,
    forecast: ForecastState,
    calcInstallment: boolean = true,
): ForecastState {
    const totalInstallments = calculateTotalInstallments(startingBalance, forecast.defaultAmount);
    let newInstallmentNumber = 0;
    let forecastPaid = "";
    let balanceRemaining = "";

    if (totalInstallments !== -1) {
        if (
            startDate &&
            startDateIsValid &&
            forecast.forecastDate &&
            forecast.forecastDateIsValid &&
            forecast.paymentFrequency !== InstallmentFrequency.UNSELECTED &&
            calcInstallment
        ) {
            newInstallmentNumber = calculateInstallment(
                startDate,
                forecast.forecastDate,
                forecast.paymentFrequency,
            );
        } else {
            newInstallmentNumber = forecast.installmentNumber;
        }

        newInstallmentNumber =
            newInstallmentNumber > totalInstallments ? totalInstallments : newInstallmentNumber;

        forecastPaid = calculateForecastPaid(
            newInstallmentNumber,
            forecast.defaultAmount,
            startingBalance,
        );
        balanceRemaining = calculateBalanceRemaining(startingBalance, forecastPaid);
    }

    return {
        totalInstallments: totalInstallments,
        installmentNumber: newInstallmentNumber,
        forecastPaid: forecastPaid,
        balanceRemaining: balanceRemaining,
        defaultAmount: forecast.defaultAmount,
        defaultAmountIsValid: forecast.defaultAmountIsValid,
        forecastDate: forecast.forecastDate,
        forecastDateIsValid: forecast.forecastDateIsValid,
        minForecastDate: forecast.minForecastDate,
        paymentFrequency: forecast.paymentFrequency,
        paymentFrequencyIsValid: forecast.paymentFrequencyIsValid,
    };
}
