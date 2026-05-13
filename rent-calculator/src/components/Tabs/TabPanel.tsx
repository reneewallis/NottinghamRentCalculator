"use client";

import React from "react";
import { TabsActions } from "../../types/Tabs";
import {
    CalculatorActions,
    RentFrequency,
    BenefitType,
    InstallmentFrequency,
} from "@/src/types/RentCalculator";
import CalculatorBox from "../PanelElements/CalculatorBox";
import { CalculatorBoxDropdownBoxes } from "../../types/PanelElements";
import DateBox from "../InputFields/DateBox";
import CalculatorPanel from "../PanelElements/CalculatorPanel";
import TextBox from "../InputFields/TextBox";
import InstallementScroller from "../PanelElements/InstallmentScroller";
import { Dayjs } from "dayjs";
import CustomDropdownBox from "../Dropdown/DropdownBox";
import { useTabsContext } from "@/src/utils/Tabs/TabsContext";
import { DATE_BOX_WIDTH, SIDE_PANEL_TEXT_BOX_WIDTH } from "../InputFields/InputFieldConsts";

function TabPanel() {
    const { tabsState, tabsDispatch } = useTabsContext();

    if (tabsState.wrappedTabArr.length > 0) {
        const activeTab = tabsState.wrappedTabArr[tabsState.activeTabIndex];
        const calculatorState = activeTab.calculatorState;
        let balanceCircleString: string;
        let balanceCircleValue: string;

        if (calculatorState.daysUntilStartDate === -1) {
            balanceCircleString = "";
            balanceCircleValue = "";
        } else {
            let timeFrame: string;

            if (calculatorState.daysUntilStartDate < 7) {
                timeFrame =
                    calculatorState.daysUntilStartDate === 1 ? "Day" : "Days";
                balanceCircleValue =
                    calculatorState.daysUntilStartDate.toString();
            } else {
                timeFrame =
                    calculatorState.weeksUntilStartDate === 1
                        ? "Week"
                        : "Weeks";
                balanceCircleValue =
                    calculatorState.weeksUntilStartDate.toString();
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
                controlled: true,
                value: calculatorState.rentFrequency,
                label: RentFrequency.UNSELECTED,
                items: [
                    {
                        label: RentFrequency.WEEKLY,
                        onClick: () => {
                            tabsDispatch({
                                type: TabsActions.USE_RENT_CALCULATOR,
                                action: {
                                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                                    newRentFrequency: RentFrequency.WEEKLY,
                                },
                            });
                        },
                    },
                    {
                        label: RentFrequency.FOUR_WEEKLY,
                        onClick: () => {
                            tabsDispatch({
                                type: TabsActions.USE_RENT_CALCULATOR,
                                action: {
                                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                                    newRentFrequency: RentFrequency.FOUR_WEEKLY,
                                },
                            });
                        },
                    },
                    {
                        label: RentFrequency.MONTHLY,
                        onClick: () => {
                            tabsDispatch({
                                type: TabsActions.USE_RENT_CALCULATOR,
                                action: {
                                    type: CalculatorActions.CHANGE_RENT_FREQUENCY,
                                    newRentFrequency: RentFrequency.MONTHLY,
                                },
                            });
                        },
                    },
                ],
                valid: calculatorState.rentFrequencyIsValid,
            },
            shortfall: {
                controlled: true,
                value: calculatorState.benefitType,
                label: BenefitType.UNSELECTED,
                items: [
                    {
                        label: BenefitType.UNIVERSAL_CREDIT,
                        onClick: () => {
                            tabsDispatch({
                                type: TabsActions.USE_RENT_CALCULATOR,
                                action: {
                                    type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                                    newBenefitType:
                                        BenefitType.UNIVERSAL_CREDIT,
                                },
                            });
                        },
                    },
                    {
                        label: BenefitType.HOUSING_BENEFIT,
                        onClick: () => {
                            tabsDispatch({
                                type: TabsActions.USE_RENT_CALCULATOR,
                                action: {
                                    type: CalculatorActions.CHANGE_BENEFIT_TYPE,
                                    newBenefitType: BenefitType.HOUSING_BENEFIT,
                                },
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
                <div className="flex-1 grid grid-cols-[repeat(2,minmax(auto,1fr))] grid-flow-row-dense overflow-x-auto justify-items-center items-end content-center p-8 gap-12">
                    <div key={"rent"} className="col-start-1">
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
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.CALCULATE_RENT,
                                            amount: e.target.value,
                                        },
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
                    <div key={"shortfall"} className="col-start-1 pb-8">
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
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.CALCULATE_SHORTFALL,
                                            amount: e.target.value,
                                        },
                                    });
                                },
                                valid: calculatorState.benefitAmountIsValid,
                            }}
                            resultTextBoxes={[
                                {
                                    label: "Weekly Shortfall",
                                    text: calculatorState.weeklyShortfall,
                                    readOnly: true,
                                    valid:
                                        +calculatorState.weeklyShortfall >= 0,
                                },
                                {
                                    label: "4-Weekly Shortfall",
                                    text: calculatorState.fourWeeklyShortfall,
                                    readOnly: true,
                                    valid:
                                        +calculatorState.fourWeeklyShortfall >=
                                        0,
                                },
                                {
                                    label: "Monthly Shortfall",
                                    text: calculatorState.monthlyShortfall,
                                    readOnly: true,
                                    valid:
                                        +calculatorState.monthlyShortfall >= 0,
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
                                text={activeTab.todayString}
                                readOnly={true}
                                width={DATE_BOX_WIDTH}
                                alignment="center"
                            ></TextBox>,
                            <DateBox
                                key={"startDate"}
                                label="Start Date"
                                controlled={true}
                                value={calculatorState.startDate}
                                setValue={(value) =>
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.SET_START_DATE,
                                            date: value,
                                        },
                                    })
                                }
                                onChange={() =>
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.CHANGE_START_DATE,
                                        },
                                    })
                                }
                                alignment="center"
                                minDate={calculatorState.minStartDate}
                                onError={(
                                    error: string | null,
                                    value: Dayjs | null,
                                ) =>
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.ON_START_DATE_ERROR,
                                            error: error,
                                            value: value,
                                        },
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
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.CALCULATE_STARTING_BALANCE,
                                            newCurrentBalance: e.target.value,
                                        },
                                    })
                                }
                                valid={calculatorState.currentBalanceIsValid}
                                width={SIDE_PANEL_TEXT_BOX_WIDTH}
                            ></TextBox>,
                            <TextBox
                                key={"startingBalance"}
                                label="Starting Balance"
                                text={calculatorState.startingBalance}
                                readOnly={true}
                                width={SIDE_PANEL_TEXT_BOX_WIDTH}
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
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.CHANGE_DEFAULT_AMOUNT,
                                            defaultAmount: e.target.value,
                                        },
                                    })
                                }
                                width={DATE_BOX_WIDTH}
                                alignment="left"
                                valid={calculatorState.defaultAmountIsValid}
                            ></TextBox>,
                            <DateBox
                                key={"forecastDate"}
                                label="Forecast Date"
                                controlled={true}
                                value={calculatorState.forecastDate}
                                setValue={(value) =>
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.SET_FORECAST_DATE,
                                            date: value,
                                        },
                                    })
                                }
                                onChange={() =>
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.CHANGE_FORCAST_DATE,
                                        },
                                    })
                                }
                                alignment="left"
                                minDate={calculatorState.minForecastDate}
                                onError={(
                                    error: string | null,
                                    value: Dayjs | null,
                                ) =>
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.ON_FORECAST_DATE_ERROR,
                                            error: error,
                                            value: value,
                                        },
                                    })
                                }
                                valid={calculatorState.forecastDateIsValid}
                            ></DateBox>,
                            <InstallementScroller
                                key={"installmentScroller"}
                                totalInstallments={
                                    calculatorState.totalInstallments
                                }
                                installmentNumber={
                                    calculatorState.installmentNumber
                                }
                                frequency={calculatorState.paymentFrequency}
                                onChange={(value) =>
                                    tabsDispatch({
                                        type: TabsActions.USE_RENT_CALCULATOR,
                                        action: {
                                            type: CalculatorActions.CHANGE_INSTALLMENT_NUMBER,
                                            number: value,
                                        },
                                    })
                                }
                            ></InstallementScroller>,
                        ]}
                        sidePanelBoxes={[
                            <CustomDropdownBox
                                controlled={true}
                                value={calculatorState.paymentFrequency}
                                key={"paymentFrequency"}
                                small={true}
                                label="Payment Frequency"
                                items={[
                                    {
                                        label: "Weekly",
                                        onClick: () => {
                                            tabsDispatch({
                                                type: TabsActions.USE_RENT_CALCULATOR,
                                                action: {
                                                    type: CalculatorActions.CHANGE_PAYMENT_FREQUENCY,
                                                    frequency:
                                                        InstallmentFrequency.WEEKLY,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        label: "Monthly",
                                        onClick: () => {
                                            tabsDispatch({
                                                type: TabsActions.USE_RENT_CALCULATOR,
                                                action: {
                                                    type: CalculatorActions.CHANGE_PAYMENT_FREQUENCY,
                                                    frequency:
                                                        InstallmentFrequency.MONTHLY,
                                                },
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
                                width={SIDE_PANEL_TEXT_BOX_WIDTH}
                            ></TextBox>,
                            <TextBox
                                key={"balanceRemaining"}
                                label="Balance Remaining"
                                text={calculatorState.balanceRemaining}
                                readOnly={true}
                                width={SIDE_PANEL_TEXT_BOX_WIDTH}
                            ></TextBox>,
                        ]}
                    ></CalculatorPanel>
                </div>
        );
    }
    return null;
}

export default TabPanel;
