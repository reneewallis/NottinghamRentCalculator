import {
  RentFrequency,
  RentState,
  BenefitType,
  ShortfallState,
  InstallmentFrequency,
  ForecastState,
} from "@/src/Types/RentCalculator";

import { Dayjs } from "dayjs";

function ceil2DP(value: number): number {
  return Math.ceil(value * 100) / 100;
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

export function calculateRent(
  frequency: RentFrequency,
  value: string,
): RentState {
  const frequencySelected = frequency !== RentFrequency.UNSELECTED;
  let valueIsValid = true;

  let weekly = "";
  let fourWeekly = "";
  let monthly = "";

  if (value !== "" && isValidNumberEntry(value)) {
    const rentAmount = +value;

    switch (frequency) {
      case RentFrequency.WEEKLY: {
        weekly = rentAmount.toFixed(2);
        fourWeekly = (rentAmount * 4).toFixed(2);
        monthly = ceil2DP((rentAmount * 52) / 12).toFixed(2);
        break;
      }

      case RentFrequency.FOUR_WEEKLY: {
        weekly = ceil2DP(rentAmount / 4).toFixed(2);
        fourWeekly = rentAmount.toFixed(2);
        monthly = ceil2DP((rentAmount * 13) / 12).toFixed(2);
        break;
      }
      case RentFrequency.MONTHLY: {
        weekly = ceil2DP((rentAmount * 12) / 52).toFixed(2);
        fourWeekly = ceil2DP((rentAmount * 12) / 13).toFixed(2);
        monthly = rentAmount.toFixed(2);
        break;
      }
    }
  } else {
    valueIsValid = false;
  }

  return {
    rentFrequency: frequency,
    rentAmount: value,
    rentFrequencyIsValid: frequencySelected,
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
  const benefitValueIsValid =
    benefitValue !== "" && isValidNumberEntry(benefitValue);
  const benefitTypeIsValid = benefitType !== BenefitType.UNSELECTED;

  let weeklyShortfall = "";
  let fourWeeklyShortfall = "";
  let monthlyShortfall = "";

  if (
    benefitValueIsValid &&
    weeklyRent !== "" &&
    fourWeeklyRent !== "" &&
    monthlyRent !== ""
  ) {
    const benefitAmount = +benefitValue;

    switch (benefitType) {
      case BenefitType.HOUSING_BENEFIT: {
        weeklyShortfall = (ceil2DP(benefitAmount / 4) - +weeklyRent).toFixed(2);
        fourWeeklyShortfall = (benefitAmount - +fourWeeklyRent).toFixed(2);
        monthlyShortfall = (
          ceil2DP((benefitAmount * 13) / 12) - +monthlyRent
        ).toFixed(2);

        break;
      }

      case BenefitType.UNIVERSAL_CREDIT: {
        weeklyShortfall = (
          ceil2DP((benefitAmount * 12) / 52) - +weeklyRent
        ).toFixed(2);
        fourWeeklyShortfall = (
          ceil2DP((benefitAmount * 12) / 13) - +fourWeeklyRent
        ).toFixed(2);
        monthlyShortfall = (benefitAmount - +monthlyRent).toFixed(2);

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
    !isValidNumberEntry(currentBalance) ||
    !isValidNumberEntry(weeklyRent)
  ) {
    return "";
  }

  const balance = +currentBalance;
  const rent = +weeklyRent;

  return (weeksUntilStartDate * rent + balance).toFixed(2);
}

function calculateTotalInstallments(
  startingBalance: string,
  defaultAmount: string,
): number {
  if (
    startingBalance === "" ||
    defaultAmount === "" ||
    !isValidNumberEntry(startingBalance) ||
    !isValidNumberEntry(defaultAmount)
  ) {
    return -1;
  }

  const balance = +startingBalance;
  const amount = +defaultAmount;

  return Math.ceil(balance / amount);
}

function calculateInstallment(
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
      installment += forecastDate
        .startOf("day")
        .diff(startDate.startOf("day"), "weeks");
      break;
    }

    case InstallmentFrequency.MONTHLY: {
      installment += forecastDate
        .startOf("day")
        .diff(startDate.startOf("day"), "months");
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
      forecastDate = startDate
        .startOf("day")
        .add(installmentNumber - 1, "weeks");
      break;
    }

    case InstallmentFrequency.MONTHLY: {
      forecastDate = startDate
        .startOf("day")
        .add(installmentNumber - 1, "months");
      break;
    }
  }

  return forecastDate.startOf("day").isBefore(minForecastDate.startOf("day"))
    ? minForecastDate
    : forecastDate;
}

function calculateForecastPaid(
  installmentNumber: number,
  defaultAmount: string,
  startingBalance: string,
): string {
  if (
    defaultAmount === "" ||
    startingBalance === "" ||
    !isValidNumberEntry(defaultAmount) ||
    !isValidNumberEntry(startingBalance)
  ) {
    return "";
  }

  if (installmentNumber === 0) {
    return "0.00";
  }

  const amount = +defaultAmount;
  const balance = +startingBalance;
  const paid = amount * installmentNumber;

  if (paid > balance) {
    return startingBalance;
  } else {
    return paid.toFixed(2);
  }
}

function calculateBalanceRemaining(
  startingBalance: string,
  totalPaid: string,
): string {
  if (
    startingBalance === "" ||
    totalPaid === "" ||
    !isValidNumberEntry(startingBalance) ||
    !isValidNumberEntry(totalPaid)
  ) {
    return "";
  }

  const balance = +startingBalance;
  const paid = +totalPaid;

  return (balance - paid).toFixed(2);
}

export function calculateForecast(
  startingBalance: string,
  startDate: Dayjs | null,
  startDateIsValid: boolean,
  forecast: ForecastState,
  calcInstallment: boolean = true,
): ForecastState {
  const totalInstallments = calculateTotalInstallments(
    startingBalance,
    forecast.defaultAmount,
  );
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
      newInstallmentNumber > totalInstallments
        ? totalInstallments
        : newInstallmentNumber;

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
