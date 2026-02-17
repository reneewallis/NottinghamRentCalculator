"use client";

import React, { useReducer} from "react";
import {PanelProps} from "@/src/Types/Tab";
import { RentAction, RentActions, RentFrequency, RentState } from "@/src/Types/Dropdown";
import CustomDropdownBox from "../Dropdown/DropdownBox";

function rentReducer(state:RentState, action:RentAction): RentState{
    switch (action.type){
        case RentActions.CHANGE_FREQUENCY : {
            return({
                frequency: action.newFrequency,
                amount: state.amount
            })
        }

        case RentActions.CALCULATE: {
            if (state.frequency !== RentFrequency.UNSELECTED){
                return({
                    frequency: state.frequency,
                    amount: action.amount
                })
            }

            return({
                frequency: RentFrequency.UNSELECTED,
                amount: null
            })
        }
    }
}

function TabPanel({content}:PanelProps){
    const [rentState, rentDispatch] = useReducer(rentReducer, {frequency: RentFrequency.UNSELECTED, amount: null})
    return (<div className="inline-block p-6 bg-gray-950 opacity-70 rounded-lg shadow-lg mt-2 border-2 border-gray-50">
                <CustomDropdownBox label={RentFrequency.UNSELECTED} boxText={rentState.frequency} items={[
                    {label: RentFrequency.WEEKLY, onClick: () => {rentDispatch({type: RentActions.CHANGE_FREQUENCY, newFrequency: RentFrequency.WEEKLY})}}, 
                    {label: RentFrequency.FOUR_WEEKLY, onClick: () => {rentDispatch({type: RentActions.CHANGE_FREQUENCY, newFrequency: RentFrequency.FOUR_WEEKLY})}}, 
                    {label: RentFrequency.MONTHLY, onClick: () => {rentDispatch({type: RentActions.CHANGE_FREQUENCY, newFrequency: RentFrequency.MONTHLY})}}
                    ]}></CustomDropdownBox>
                <p className="text-gray-50">{content.paragraph}</p>
            </div>);
}

export default TabPanel;