"use client";

import React, { useReducer } from "react";
import { PanelProps } from "../../Types/Tabs";
import {
  CalculatorAction,
  CalculatorActions,
  RentFrequency,
  CalculatorState,
  RentState,
  BenefitType,
  ShortfallState,
  BalanceState,
  InstallmentFrequency,
  ForecastState,
} from "@/src/Types/RentCalculator";
import CalculatorBox from "../PanelElements/CalculatorBox";
import { CalculatorBoxProps } from "../../Types/PanelElements";
import DateBox from "../InputFields/DateBox";
import CalculatorPanel from "../PanelElements/CalculatorPanel";
import TextBox from "../InputFields/TextBox";
import InstallementScroller from "../PanelElements/InstallmentScroller";
import { Dayjs } from "dayjs";
import CustomDropdownBox from "../Dropdown/DropdownBox";

function ceil2DP(value: number): number {
  return Math.ceil(value * 100) / 100;
}

function isValidNumberEntry(value: string): boolean {
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

function calculateRent(frequency: RentFrequency, value: string): RentState {
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

function calculateShortfall(
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

function calculateStartingBalance(
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
  if (forecastDate.isBefore(startDate)) {
    return 0;
  }

  let installment = 1;

  switch (paymentFrequency) {
    case InstallmentFrequency.UNSELECTED: {
      return 0;
    }

    case InstallmentFrequency.WEEKLY: {
      installment += forecastDate.diff(startDate, "weeks");
      break;
    }

    case InstallmentFrequency.MONTHLY: {
      installment += forecastDate.diff(startDate, "months");
      break;
    }
  }

  return installment;
}

function calculateForecastDate(
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
      forecastDate = startDate.add(installmentNumber - 1, "weeks");
      break;
    }

    case InstallmentFrequency.MONTHLY: {
      forecastDate = startDate.add(installmentNumber - 1, "months");
      break;
    }
  }

  return forecastDate.isBefore(minForecastDate)
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

function calculateForecast(
  startingBalance: string,
  startDate: Dayjs | null,
  startDateIsValid: boolean,
  forecast: ForecastState,
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
      forecast.paymentFrequency !== InstallmentFrequency.UNSELECTED
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

function reducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  let rent: RentState = {
    rentFrequency: state.rentFrequency,
    rentAmount: state.rentAmount,
    rentFrequencyIsValid: state.rentFrequencyIsValid,
    rentAmountIsValid: state.rentAmountIsValid,
    weeklyRent: state.weeklyRent,
    fourWeeklyRent: state.fourWeeklyRent,
    monthlyRent: state.monthlyRent,
  };

  let shortfall: ShortfallState = {
    benefitType: state.benefitType,
    benefitAmount: state.benefitAmount,
    benefitTypeIsValid: state.benefitTypeIsValid,
    benefitAmountIsValid: state.benefitAmountIsValid,
    weeklyShortfall: state.weeklyShortfall,
    fourWeeklyShortfall: state.fourWeeklyShortfall,
    monthlyShortfall: state.monthlyShortfall,
  };

  const balance: BalanceState = {
    startDate: state.startDate,
    minStartDate: state.minStartDate,
    startDateIsValid: state.startDateIsValid,
    daysUntilStartDate: state.daysUntilStartDate,
    weeksUntilStartDate: state.weeksUntilStartDate,
    currentBalance: state.currentBalance,
    currentBalanceIsValid: state.currentBalanceIsValid,
    startingBalance: state.startingBalance,
  };

  let forecast: ForecastState = {
    paymentFrequency: state.paymentFrequency,
    paymentFrequencyIsValid: state.paymentFrequencyIsValid,
    totalInstallments: state.totalInstallments,
    installmentNumber: state.installmentNumber,
    forecastDate: state.forecastDate,
    forecastDateIsValid: state.forecastDateIsValid,
    minForecastDate: state.minForecastDate,
    defaultAmount: state.defaultAmount,
    defaultAmountIsValid: state.defaultAmountIsValid,
    forecastPaid: state.forecastPaid,
    balanceRemaining: state.balanceRemaining,
  };

  switch (action.type) {
    case CalculatorActions.CHANGE_RENT_FREQUENCY: {
      rent.rentFrequency = action.newRentFrequency;
      rent.rentFrequencyIsValid = true;

      if (rent.rentAmount !== "") {
        rent = calculateRent(rent.rentFrequency, rent.rentAmount);

        if (balance.startDateIsValid) {
          balance.startingBalance = calculateStartingBalance(
            balance.weeksUntilStartDate,
            balance.currentBalance,
            rent.weeklyRent,
          );

          forecast = calculateForecast(
            balance.startingBalance,
            balance.startDate,
            balance.startDateIsValid,
            forecast,
          );
        }

        if (shortfall.benefitAmount !== "") {
          shortfall = calculateShortfall(
            shortfall.benefitType,
            shortfall.benefitAmount,
            rent.weeklyRent,
            rent.fourWeeklyRent,
            rent.monthlyRent,
          );
        }
      }

      break;
    }

    case CalculatorActions.CALCULATE_RENT: {
      rent.rentAmount = action.amount;
      rent = calculateRent(rent.rentFrequency, rent.rentAmount);

      if (shortfall.benefitAmount !== "") {
        shortfall = calculateShortfall(
          shortfall.benefitType,
          shortfall.benefitAmount,
          rent.weeklyRent,
          rent.fourWeeklyRent,
          rent.monthlyRent,
        );
      }

      if (balance.startDate && balance.startDateIsValid) {
        balance.startingBalance = calculateStartingBalance(
          balance.weeksUntilStartDate,
          balance.currentBalance,
          rent.weeklyRent,
        );

        forecast = calculateForecast(
          balance.startingBalance,
          balance.startDate,
          balance.startDateIsValid,
          forecast,
        );
      }

      if (
        rent.rentAmount === "" &&
        rent.rentFrequency === RentFrequency.UNSELECTED &&
        shortfall.benefitAmount === "" &&
        shortfall.benefitType === BenefitType.UNSELECTED &&
        balance.startDate === null &&
        balance.currentBalance === "" &&
        forecast.defaultAmount === "" &&
        forecast.forecastDate === null &&
        forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
      ) {
        rent.rentFrequencyIsValid = true;
        rent.rentAmountIsValid = true;
      }

      break;
    }

    case CalculatorActions.CHANGE_BENEFIT_TYPE: {
      shortfall.benefitType = action.newBenefitType;

      if (shortfall.benefitAmount !== "") {
        shortfall = calculateShortfall(
          shortfall.benefitType,
          shortfall.benefitAmount,
          rent.weeklyRent,
          rent.fourWeeklyRent,
          rent.monthlyRent,
        );
      }

      if (rent.rentFrequency === RentFrequency.UNSELECTED) {
        rent.rentFrequencyIsValid = false;
      }

      if (rent.rentAmount === "") {
        rent.rentAmountIsValid = false;
      }

      break;
    }

    case CalculatorActions.CALCULATE_SHORTFALL: {
      shortfall.benefitAmount = action.amount;

      shortfall = calculateShortfall(
        shortfall.benefitType,
        shortfall.benefitAmount,
        rent.weeklyRent,
        rent.fourWeeklyRent,
        rent.monthlyRent,
      );

      if (shortfall.benefitAmount !== "") {
        if (rent.rentFrequency === RentFrequency.UNSELECTED) {
          rent.rentFrequencyIsValid = false;
        }

        if (rent.rentAmount === "") {
          rent.rentAmountIsValid = false;
        }
      } else {
        shortfall.benefitAmountIsValid = true;
        if (shortfall.benefitType === BenefitType.UNSELECTED) {
          shortfall.benefitTypeIsValid = true;
          if (
            rent.rentAmount === "" &&
            balance.currentBalance === "" &&
            balance.startDate === null &&
            forecast.forecastDate === null &&
            forecast.defaultAmount === "" &&
            forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
          ) {
            rent.rentAmountIsValid = true;
            if (rent.rentFrequency === RentFrequency.UNSELECTED) {
              rent.rentFrequencyIsValid = true;
            }
          }
        }
      }

      break;
    }

    case CalculatorActions.SET_START_DATE: {
      balance.startDate = action.date;
      break;
    }

    case CalculatorActions.ON_START_DATE_ERROR: {
      if (action.error) {
        balance.startDateIsValid = false;
        balance.daysUntilStartDate = -1;
        balance.weeksUntilStartDate = -1;
        balance.startingBalance = "";
        forecast.balanceRemaining = "";
        forecast.installmentNumber = 0;
        forecast.forecastPaid = "";
        forecast.totalInstallments = -1;
        console.log(`start date error:${action.error}\nvalue:${action.value}`);
      }
      break;
    }

    case CalculatorActions.CHANGE_START_DATE: {
      if (balance.startDate !== null) {
        balance.startDateIsValid = true;
        balance.daysUntilStartDate = balance.startDate.diff(
          balance.minStartDate,
          "days",
        );
        balance.weeksUntilStartDate = Math.ceil(balance.daysUntilStartDate / 7);
        balance.startingBalance = calculateStartingBalance(
          balance.weeksUntilStartDate,
          balance.currentBalance,
          rent.weeklyRent,
        );

        if (
          forecast.paymentFrequency !== InstallmentFrequency.UNSELECTED &&
          forecast.forecastDate === null
        ) {
          if (balance.startDate && balance.startDateIsValid) {
            const forecastDate = calculateForecastDate(
              balance.startDate,
              forecast.minForecastDate,
              forecast.paymentFrequency,
              forecast.installmentNumber,
            );
            if (forecastDate) {
              forecast.forecastDate = forecastDate;
            }
          }
        }

        if (balance.weeksUntilStartDate !== 0) {
          if (rent.rentFrequency === RentFrequency.UNSELECTED) {
            rent.rentFrequencyIsValid = false;
          }

          if (rent.rentAmount === "") {
            rent.rentAmountIsValid = false;
          }
        } else {
          if (
            rent.rentAmount === "" &&
            shortfall.benefitAmount === "" &&
            shortfall.benefitType === BenefitType.UNSELECTED
          ) {
            rent.rentAmountIsValid = true;
            if (rent.rentFrequency === RentFrequency.UNSELECTED) {
              rent.rentFrequencyIsValid = true;
            }
          }
        }
      } else {
        balance.daysUntilStartDate = -1;
        balance.weeksUntilStartDate = -1;
        balance.startingBalance = "";

        if (
          balance.currentBalance === "" &&
          forecast.defaultAmount === "" &&
          forecast.forecastDate === null &&
          forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
        ) {
          balance.startDateIsValid = true;
          if (
            rent.rentAmount === "" &&
            balance.currentBalance === "" &&
            balance.startDate === null &&
            shortfall.benefitType === BenefitType.UNSELECTED &&
            shortfall.benefitAmount === "" &&
            forecast.defaultAmount === "" &&
            forecast.forecastDate === null &&
            forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
          ) {
            rent.rentAmountIsValid = true;
            if (rent.rentFrequency === RentFrequency.UNSELECTED) {
              rent.rentFrequencyIsValid = true;
            }
          }
        } else {
          balance.startDateIsValid = false;
        }
      }

      forecast = calculateForecast(
        balance.startingBalance,
        balance.startDate,
        balance.startDateIsValid,
        forecast,
      );

      break;
    }

    case CalculatorActions.CALCULATE_STARTING_BALANCE: {
      balance.currentBalance = action.newCurrentBalance;

      balance.startingBalance = calculateStartingBalance(
        balance.weeksUntilStartDate,
        balance.currentBalance,
        rent.weeklyRent,
      );
      forecast = calculateForecast(
        balance.startingBalance,
        balance.startDate,
        balance.startDateIsValid,
        forecast,
      );

      if (balance.currentBalance !== "") {
        balance.currentBalanceIsValid = isValidNumberEntry(
          balance.currentBalance,
        );

        if (balance.weeksUntilStartDate !== 0) {
          if (rent.rentFrequency === RentFrequency.UNSELECTED) {
            rent.rentFrequencyIsValid = false;
          }

          if (rent.rentAmount === "") {
            rent.rentAmountIsValid = false;
          }
        } else {
          if (
            rent.rentAmount === "" &&
            shortfall.benefitAmount === "" &&
            shortfall.benefitType === BenefitType.UNSELECTED
          ) {
            rent.rentAmountIsValid = true;
            if (rent.rentFrequency === RentFrequency.UNSELECTED) {
              rent.rentFrequencyIsValid = true;
            }
          }
        }

        if (balance.startDate === null) {
          balance.startDateIsValid = false;
        }
      } else {
        if (
          forecast.forecastDate === null &&
          forecast.defaultAmount === "" &&
          forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
        ) {
          balance.currentBalanceIsValid = true;
          if (balance.startDate === null) {
            balance.startDateIsValid = true;
            if (
              rent.rentAmount === "" &&
              shortfall.benefitType === BenefitType.UNSELECTED &&
              shortfall.benefitAmount === ""
            ) {
              rent.rentAmountIsValid = true;
              if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                rent.rentFrequencyIsValid = true;
              }
            }
          }
        } else {
          balance.currentBalanceIsValid = false;
        }
      }

      break;
    }

    case CalculatorActions.CHANGE_PAYMENT_FREQUENCY: {
      forecast.paymentFrequency = action.frequency;
      forecast.paymentFrequencyIsValid = true;
      if (
        forecast.forecastDate === null &&
        balance.startDate &&
        balance.startDateIsValid
      ) {
        const forecastDate = calculateForecastDate(
          balance.startDate,
          forecast.minForecastDate,
          forecast.paymentFrequency,
          forecast.installmentNumber,
        );
        if (forecastDate) {
          forecast.forecastDate = forecastDate;
        }
      }
      forecast = calculateForecast(
        balance.startingBalance,
        balance.startDate,
        balance.startDateIsValid,
        forecast,
      );

      if (forecast.defaultAmount === "") {
        forecast.defaultAmountIsValid = false;
      }

      if (balance.currentBalance === "") {
        balance.currentBalanceIsValid = false;
      }

      if (balance.startDate === null) {
        balance.startDateIsValid = false;
      }

      if (balance.weeksUntilStartDate !== 0) {
        if (rent.rentFrequency === RentFrequency.UNSELECTED) {
          rent.rentFrequencyIsValid = false;
        }

        if (rent.rentAmount === "") {
          rent.rentAmountIsValid = false;
        }
      }

      break;
    }

    case CalculatorActions.SET_FORECAST_DATE: {
      forecast.forecastDate = action.date;
      break;
    }

    case CalculatorActions.ON_FORECAST_DATE_ERROR: {
      if (action.error) {
        forecast.forecastDateIsValid = false;
        console.log(
          `forcast date error:${action.error}\nvalue:${action.value}`,
        );
      }
      break;
    }

    case CalculatorActions.CHANGE_FORCAST_DATE: {
      forecast.forecastDateIsValid = true;
      forecast = calculateForecast(
        balance.startingBalance,
        balance.startDate,
        balance.startDateIsValid,
        forecast,
      );

      if (forecast.forecastDate !== null) {
        if (balance.startDate === null) {
          balance.startDateIsValid = false;
        }

        if (balance.currentBalance === "") {
          balance.currentBalanceIsValid = false;
        }

        if (balance.weeksUntilStartDate !== 0) {
          if (rent.rentFrequency === RentFrequency.UNSELECTED) {
            rent.rentFrequencyIsValid = false;
          }

          if (rent.rentAmount === "") {
            rent.rentAmountIsValid = false;
          }
        }

        if (forecast.paymentFrequency === InstallmentFrequency.UNSELECTED) {
          forecast.paymentFrequencyIsValid = false;
        }

        if (forecast.defaultAmount === "") {
          forecast.defaultAmountIsValid = false;
        }
      } else {
        if (forecast.paymentFrequency === InstallmentFrequency.UNSELECTED) {
          forecast.paymentFrequencyIsValid = true;
          if (forecast.defaultAmount === "") {
            forecast.defaultAmountIsValid = true;
            if (balance.currentBalance === "") {
              balance.currentBalanceIsValid = true;
              if (balance.startDate === null) {
                balance.startDateIsValid = true;
                if (
                  rent.rentAmount === "" &&
                  shortfall.benefitType === BenefitType.UNSELECTED &&
                  shortfall.benefitAmount === ""
                ) {
                  rent.rentAmountIsValid = true;
                  if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                    rent.rentFrequencyIsValid = true;
                  }
                }
              }
            }
          }
        }
      }

      break;
    }

    case CalculatorActions.CHANGE_DEFAULT_AMOUNT: {
      forecast.defaultAmount = action.defaultAmount;
      forecast = calculateForecast(
        balance.startingBalance,
        balance.startDate,
        balance.startDateIsValid,
        forecast,
      );

      if (forecast.defaultAmount !== "") {
        forecast.defaultAmountIsValid = isValidNumberEntry(
          forecast.defaultAmount,
        );
        if (balance.weeksUntilStartDate !== 0) {
          if (rent.rentFrequency === RentFrequency.UNSELECTED) {
            rent.rentFrequencyIsValid = false;
          }

          if (rent.rentAmount === "") {
            rent.rentAmountIsValid = false;
          }
        }

        if (balance.startDate === null) {
          balance.startDateIsValid = false;
        }

        if (balance.currentBalance === "") {
          balance.currentBalanceIsValid = false;
        }
      } else {
        if (
          forecast.forecastDate === null &&
          forecast.paymentFrequency === InstallmentFrequency.UNSELECTED
        ) {
          forecast.defaultAmountIsValid = true;
          if (balance.currentBalance === "") {
            balance.currentBalanceIsValid = true;
            if (balance.startDate === null) {
              balance.startDateIsValid = true;
              if (
                rent.rentAmount === "" &&
                shortfall.benefitType === BenefitType.UNSELECTED &&
                shortfall.benefitAmount === ""
              ) {
                rent.rentAmountIsValid = true;
                if (rent.rentFrequency === RentFrequency.UNSELECTED) {
                  rent.rentFrequencyIsValid = true;
                }
              }
            }
          }
        } else {
          forecast.defaultAmountIsValid = false;
        }
      }

      break;
    }

    case CalculatorActions.CHANGE_INSTALLMENT_NUMBER: {
      forecast.installmentNumber = action.number;

      if (forecast.paymentFrequency === InstallmentFrequency.UNSELECTED) {
        forecast.paymentFrequencyIsValid = false;
      }

      if (balance.startDate && balance.startDateIsValid) {
        const forecastDate = calculateForecastDate(
          balance.startDate,
          forecast.minForecastDate,
          forecast.paymentFrequency,
          forecast.installmentNumber,
        );
        if (forecastDate) {
          forecast.forecastDate = forecastDate;
        }
      }

      forecast = calculateForecast(
        balance.startingBalance,
        balance.startDate,
        balance.startDateIsValid,
        forecast,
      );

      break;
    }
  }

  return {
    ...rent,
    ...shortfall,
    ...balance,
    ...forecast,
  };
}

function initCalculatorState(today: Dayjs): CalculatorState {
  return {
    rentFrequency: RentFrequency.UNSELECTED,
    rentAmount: "",
    rentFrequencyIsValid: true,
    rentAmountIsValid: true,
    weeklyRent: "",
    fourWeeklyRent: "",
    monthlyRent: "",
    benefitType: BenefitType.UNSELECTED,
    benefitAmount: "",
    benefitTypeIsValid: true,
    benefitAmountIsValid: true,
    weeklyShortfall: "",
    fourWeeklyShortfall: "",
    monthlyShortfall: "",
    startDate: null,
    minStartDate: today,
    startDateIsValid: true,
    daysUntilStartDate: -1,
    weeksUntilStartDate: -1,
    currentBalance: "",
    currentBalanceIsValid: true,
    startingBalance: "",
    paymentFrequency: InstallmentFrequency.UNSELECTED,
    paymentFrequencyIsValid: true,
    totalInstallments: -1,
    installmentNumber: 0,
    forecastDate: null,
    forecastDateIsValid: true,
    minForecastDate: today,
    defaultAmount: "",
    defaultAmountIsValid: true,
    forecastPaid: "",
    balanceRemaining: "",
  };
}

function TabPanel({ today, todayString }: PanelProps) {
  const [calculatorState, calculatorDispatch] = useReducer(
    reducer,
    today,
    initCalculatorState,
  );

  const calculatorBoxes: ({ name: string } & CalculatorBoxProps)[] = [
    {
      name: "RentFrequency",
      dropDownProps: {
        label: RentFrequency.UNSELECTED,
        items: [
          {
            label: RentFrequency.WEEKLY,
            onClick: () => {
              calculatorDispatch({
                type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                newRentFrequency: RentFrequency.WEEKLY,
              });
            },
          },
          {
            label: RentFrequency.FOUR_WEEKLY,
            onClick: () => {
              calculatorDispatch({
                type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                newRentFrequency: RentFrequency.FOUR_WEEKLY,
              });
            },
          },
          {
            label: RentFrequency.MONTHLY,
            onClick: () => {
              calculatorDispatch({
                type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                newRentFrequency: RentFrequency.MONTHLY,
              });
            },
          },
        ],
        valid: calculatorState.rentFrequencyIsValid,
      },
      inputTextBoxProps: {
        label: "Rent Amount",
        text: calculatorState.rentAmount,
        readOnly: false,
        onChange: (e) => {
          calculatorDispatch({
            type: CalculatorActions.CALCULATE_RENT,
            amount: e.target.value,
          });
        },
        valid: calculatorState.rentAmountIsValid,
      },
      resultTextBoxes: [
        {
          label: "Weekly Rent",
          text: calculatorState.weeklyRent,
          readOnly: true,
        },
        {
          label: "4-Weekly Rent",
          text: calculatorState.fourWeeklyRent,
          readOnly: true,
        },
        {
          label: "Monthly Rent",
          text: calculatorState.monthlyRent,
          readOnly: true,
        },
      ],
    },
    {
      name: "shortfall",
      dropDownProps: {
        label: BenefitType.UNSELECTED,
        items: [
          {
            label: BenefitType.UNIVERSAL_CREDIT,
            onClick: () => {
              calculatorDispatch({
                type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                newBenefitType: BenefitType.UNIVERSAL_CREDIT,
              });
            },
          },
          {
            label: BenefitType.HOUSING_BENEFIT,
            onClick: () => {
              calculatorDispatch({
                type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                newBenefitType: BenefitType.HOUSING_BENEFIT,
              });
            },
          },
        ],
        valid: calculatorState.benefitTypeIsValid,
      },
      inputTextBoxProps: {
        label: "Benefit Amount",
        text: calculatorState.benefitAmount,
        readOnly: false,
        onChange: (e) => {
          calculatorDispatch({
            type: CalculatorActions.CALCULATE_SHORTFALL,
            amount: e.target.value,
          });
        },
        valid: calculatorState.benefitAmountIsValid,
      },
      resultTextBoxes: [
        {
          label: "Weekly Shortfall",
          text: calculatorState.weeklyShortfall,
          readOnly: true,
          valid: +calculatorState.weeklyShortfall >= 0,
        },
        {
          label: "4-Weekly Shortfall",
          text: calculatorState.fourWeeklyShortfall,
          readOnly: true,
          valid: +calculatorState.fourWeeklyShortfall >= 0,
        },
        {
          label: "Monthly Shortfall",
          text: calculatorState.monthlyShortfall,
          readOnly: true,
          valid: +calculatorState.monthlyShortfall >= 0,
        },
      ],
    },
  ];

  let balanceCircleString: string;
  let balanceCircleValue: string;

  if (calculatorState.daysUntilStartDate === -1) {
    balanceCircleString = "";
    balanceCircleValue = "";
  } else {
    let timeFrame: string;

    if (calculatorState.daysUntilStartDate < 7) {
      timeFrame = calculatorState.daysUntilStartDate === 1 ? "Day" : "Days";
      balanceCircleValue = calculatorState.daysUntilStartDate.toString();
    } else {
      timeFrame = calculatorState.weeksUntilStartDate === 1 ? "Week" : "Weeks";
      balanceCircleValue = calculatorState.weeksUntilStartDate.toString();
    }

    balanceCircleString = `${timeFrame} until Arrangment Start Date`;
  }

  let forecastCircleValue;
  let forcastCircleLabel;

  if (calculatorState.totalInstallments === -1) {
    forecastCircleValue = "";
    forcastCircleLabel = "";
  } else {
    forecastCircleValue = `${calculatorState.totalInstallments - calculatorState.installmentNumber}`;
    forcastCircleLabel = `${forecastCircleValue === "1" ? "Installment" : "Installments"} Left`;
  }

  const minDropdownWidth =
    Math.max(
      0,
      ...calculatorBoxes.map((box) =>
        Math.max(
          box.dropDownProps.label.length,
          ...box.dropDownProps.items.map((item) => item.label.length),
        ),
      ),
    ) * 1.15;
  return (
    <div className="mt-6 px-6 w-full">
      <div className="grid grid-cols-[repeat(2,minmax(35.5rem,1fr))] grid-flow-row-dense overflow-x-auto justify-start items-center gap-12 pb-5">
        {calculatorBoxes.map((box) => (
          <div key={box.name} className="col-start-1 mt-37.75">
            <CalculatorBox
              dropDownProps={{
                ...box.dropDownProps,
                minWidth: minDropdownWidth,
              }}
              inputTextBoxProps={box.inputTextBoxProps}
              resultTextBoxes={box.resultTextBoxes}
            ></CalculatorBox>
          </div>
        ))}

        <CalculatorPanel
          circleValue={balanceCircleValue}
          circleLabel={balanceCircleString}
          flipPanel={true}
          mainPanelBoxes={[
            <TextBox
              key={"todayDate"}
              label="Today's Date"
              text={todayString}
              readOnly={true}
              width={13.536}
              alignment="center"
            ></TextBox>,
            <DateBox
              key={"startDate"}
              label="Start Date"
              controlled={true}
              value={calculatorState.startDate}
              setValue={(value) =>
                calculatorDispatch({
                  type: CalculatorActions.SET_START_DATE,
                  date: value,
                })
              }
              onChange={() =>
                calculatorDispatch({
                  type: CalculatorActions.CHANGE_START_DATE,
                })
              }
              alignment="center"
              minDate={calculatorState.minStartDate}
              onError={(error: string | null, value: Dayjs | null) =>
                calculatorDispatch({
                  type: CalculatorActions.ON_START_DATE_ERROR,
                  error: error,
                  value: value,
                })
              }
              valid={calculatorState.startDateIsValid}
            ></DateBox>,
          ]}
          sidePanelBoxes={[
            <TextBox
              key={"currentBalance"}
              label="Current Balance"
              text={calculatorState.currentBalance}
              readOnly={false}
              onChange={(e) =>
                calculatorDispatch({
                  type: CalculatorActions.CALCULATE_STARTING_BALANCE,
                  newCurrentBalance: e.target.value,
                })
              }
              valid={calculatorState.currentBalanceIsValid}
            ></TextBox>,
            <TextBox
              key={"startingBalance"}
              label="Starting Balance"
              text={calculatorState.startingBalance}
              readOnly={true}
            ></TextBox>,
          ]}
        ></CalculatorPanel>
        <CalculatorPanel
          circleValue={forecastCircleValue}
          circleLabel={forcastCircleLabel}
          flipPanel={true}
          mainPanelBoxes={[
            <TextBox
              key={"defaultAmount"}
              label="Default Amount"
              text={calculatorState.defaultAmount}
              readOnly={false}
              onChange={(e) =>
                calculatorDispatch({
                  type: CalculatorActions.CHANGE_DEFAULT_AMOUNT,
                  defaultAmount: e.target.value,
                })
              }
              width={13.536}
              alignment="left"
              valid={calculatorState.defaultAmountIsValid}
            ></TextBox>,
            <DateBox
              key={"forecastDate"}
              label="Forecast Date"
              controlled={true}
              value={calculatorState.forecastDate}
              setValue={(value) =>
                calculatorDispatch({
                  type: CalculatorActions.SET_FORECAST_DATE,
                  date: value,
                })
              }
              onChange={() =>
                calculatorDispatch({
                  type: CalculatorActions.CHANGE_FORCAST_DATE,
                })
              }
              alignment="left"
              minDate={calculatorState.minForecastDate}
              onError={(error: string | null, value: Dayjs | null) =>
                calculatorDispatch({
                  type: CalculatorActions.ON_FORECAST_DATE_ERROR,
                  error: error,
                  value: value,
                })
              }
              valid={calculatorState.forecastDateIsValid}
            ></DateBox>,
            <InstallementScroller
              key={"installmentScroller"}
              totalInstallments={calculatorState.totalInstallments}
              installmentNumber={calculatorState.installmentNumber}
              frequency={calculatorState.paymentFrequency}
              onChange={(value) =>
                calculatorDispatch({
                  type: CalculatorActions.CHANGE_INSTALLMENT_NUMBER,
                  number: value,
                })
              }
            ></InstallementScroller>,
          ]}
          sidePanelBoxes={[
            <CustomDropdownBox
              key={"paymentFrequency"}
              small={true}
              label="Payment Frequency"
              items={[
                {
                  label: "Weekly",
                  onClick: () => {
                    calculatorDispatch({
                      type: CalculatorActions.CHANGE_PAYMENT_FREQUENCY,
                      frequency: InstallmentFrequency.WEEKLY,
                    });
                  },
                },
                {
                  label: "Monthly",
                  onClick: () => {
                    calculatorDispatch({
                      type: CalculatorActions.CHANGE_PAYMENT_FREQUENCY,
                      frequency: InstallmentFrequency.MONTHLY,
                    });
                  },
                },
              ]}
              valid={calculatorState.paymentFrequencyIsValid}
            ></CustomDropdownBox>,
            <TextBox
              key={"totalPaid"}
              label="Total Paid"
              text={calculatorState.forecastPaid}
              readOnly={true}
            ></TextBox>,
            <TextBox
              key={"balanceRemaining"}
              label="Balance Remaining"
              text={calculatorState.balanceRemaining}
              readOnly={true}
            ></TextBox>,
          ]}
        ></CalculatorPanel>
      </div>
    </div>
  );
}

export default TabPanel;
