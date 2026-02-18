"use client";

import React, { useReducer } from "react";
import {PanelProps} from "@/src/Types/Tabs";
import { RentAction, RentActions, RentFrequency, RentState } from "@/src/Types/RentCalculator";
import CalculatorBox from "../PanelElements/CalculatorBox";

function ceil2DP(value: number): number {
    return Math.ceil(value * 100) / 100;
}

function isValidNumberEntry(value:string): boolean{
    const numerical = +value;

    if (isNaN(numerical)){
        return false;
    }

    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1){
        if (value.substring(decimalIndex).length !== 3){
            return false;
        }
    }

    return true;
}

function calculateRent(frequency:RentFrequency, value:string): RentState{
    const rentAmount = +value;
            let weekly = '';
            let fourWeekly = '';
            let monthly = '';

            if (value !== '' && isValidNumberEntry(value) && !isNaN(rentAmount)){
                switch (frequency){
                    case RentFrequency.WEEKLY: {
                        weekly = rentAmount.toFixed(2);
                        fourWeekly = (rentAmount * 4).toFixed(2);
                        monthly = ceil2DP(((rentAmount * 52) / 12)).toFixed(2);

                        break;
                    }
                    
                    case RentFrequency.FOUR_WEEKLY: {
                        weekly = ceil2DP(rentAmount / 4).toFixed(2);
                        monthly = ceil2DP((rentAmount * 13) / 12).toFixed(2);
                        fourWeekly = rentAmount.toFixed(2);

                        break;
                    }

                    case RentFrequency.MONTHLY: {
                        weekly = ceil2DP((rentAmount * 12) / 52).toFixed(2);
                        monthly = rentAmount.toFixed(2);
                        fourWeekly = ceil2DP((rentAmount * 12) / 13).toFixed(2);

                        break;
                    }
                }
            }

            return({
                frequency: frequency,
                amount: value,
                weeklyAmount: weekly,
                fourWeeklyAmount: fourWeekly,
                monthlyAmount: monthly
            })

}

function rentReducer(state:RentState, action:RentAction): RentState{
    switch (action.type){
        case RentActions.CHANGE_FREQUENCY : {

            if (state.amount !== ''){
                return calculateRent(action.newFrequency, state.amount);
            }

            return({
                frequency: action.newFrequency,
                amount: state.amount,
                weeklyAmount: '',
                fourWeeklyAmount: '',
                monthlyAmount: '',
            })
        }

        case RentActions.CALCULATE: {
            return calculateRent(state.frequency, action.amount);
        }
    }
}

function initRentState(frequency: RentFrequency): RentState{
    return({
        frequency: frequency,
        amount: '',
        weeklyAmount: '',
        fourWeeklyAmount: '',
        monthlyAmount: ''
    })
}


function TabPanel({content}:PanelProps){
    const [rentState, rentDispatch] = useReducer(rentReducer, RentFrequency.UNSELECTED, initRentState)
    return (<div className="mt-2">
                <CalculatorBox 
                    dropDownProps={{
                        label: RentFrequency.UNSELECTED,
                        boxText: rentState.frequency,
                        items: [
                            {label: RentFrequency.WEEKLY, onClick: () => {rentDispatch({type: RentActions.CHANGE_FREQUENCY, newFrequency: RentFrequency.WEEKLY})}}, 
                            {label: RentFrequency.FOUR_WEEKLY, onClick: () => {rentDispatch({type: RentActions.CHANGE_FREQUENCY, newFrequency: RentFrequency.FOUR_WEEKLY})}}, 
                            {label: RentFrequency.MONTHLY, onClick: () => {rentDispatch({type: RentActions.CHANGE_FREQUENCY, newFrequency: RentFrequency.MONTHLY})}}
                        ]
                    }}

                    inputTextBoxProps={{
                        label:"Rent Amount",
                        text: rentState.amount,
                        readOnly: false,
                        onChange: e => {rentDispatch({type: RentActions.CALCULATE, amount: e.target.value})}
                    }}

                    resultTextBoxes={[
                        {label: "Weekly Rent", text: rentState.weeklyAmount, readOnly: true},
                        {label: "4-Weekly Rent", text: rentState.fourWeeklyAmount, readOnly: true},
                        {label: "Monthly Rent", text: rentState.monthlyAmount, readOnly:true}
                    ]}
                    ></CalculatorBox>
                <p className="text-gray-50">{content.paragraph}</p>
            </div>);
}

export default TabPanel;