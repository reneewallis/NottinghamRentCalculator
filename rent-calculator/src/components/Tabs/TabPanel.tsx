"use client";

import React, { useReducer } from "react";
import { PanelProps } from "../../Types/Tabs";
import {
  CalculatorActions,
  RentFrequency,
  BenefitType,
  InstallmentFrequency,
} from "@/src/Types/RentCalculator";
import CalculatorBox from "../PanelElements/CalculatorBox";
import { CalculatorBoxDropdownBoxes } from "../../Types/PanelElements";
import DateBox from "../InputFields/DateBox";
import CalculatorPanel from "../PanelElements/CalculatorPanel";
import TextBox from "../InputFields/TextBox";
import InstallementScroller from "../PanelElements/InstallmentScroller";
import { Dayjs } from "dayjs";
import CustomDropdownBox from "../Dropdown/DropdownBox";
import {
  initCalculatorState,
  rentCalculatorReducer,
} from "@/src/features/RentCalculator/RentCalculatorReducer";

function TabPanel({ today, todayString }: PanelProps) {
  const [calculatorState, calculatorDispatch] = useReducer(
    rentCalculatorReducer,
    today,
    initCalculatorState,
  );

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

  const calcBoxDropdowns: CalculatorBoxDropdownBoxes = {
    rent: {
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
    shortfall: {
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
  };

  const minDropdownWidth =
    Math.max(
      0,
      ...Object.values(calcBoxDropdowns).flatMap((dropdown) => [
        dropdown.label.length,
        ...dropdown.items.map((item) => item.label.length),
      ]),
    ) * 1.15;
  return (
    <div className="mt-6 px-6 w-full">
      <div className="grid grid-cols-[repeat(2,minmax(35.5rem,1fr))] grid-flow-row-dense overflow-x-auto justify-start items-center gap-12 pb-5">
        <div key={"rent"} className="col-start-1 mt-37.75">
          <CalculatorBox
            dropDownProps={{
              ...calcBoxDropdowns.rent,
              minWidth: minDropdownWidth,
            }}
            inputTextBoxProps={{
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
            }}
            resultTextBoxes={[
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
            ]}
          ></CalculatorBox>
        </div>
        <div key={"shortfall"} className="col-start-1 mt-37.75">
          <CalculatorBox
            dropDownProps={{
              ...calcBoxDropdowns.shortfall,
              minWidth: minDropdownWidth,
            }}
            inputTextBoxProps={{
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
            }}
            resultTextBoxes={[
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
            ]}
          ></CalculatorBox>
        </div>

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
