"use client";

import React from "react";
import { CalculatorPanelProps } from "@/src/Types/PanelElements";

function CalculatorPanel({circleValue, circleLabel, mainPanelBoxes, sidePanelBoxes, flipPanel = false}:CalculatorPanelProps){
    return(
    <div className={`inline-flex items-center ${flipPanel? "justify-end": "justify-start"}`}>
        {flipPanel &&
            <div className="mt-40 inline-flex gap-4 -mr-5 flex-col items-start bg-gray-800 rounded-2xl shadow-lg border-y-4 border-l-4 border-gray-300 pl-7 pr-10 pt-6 pb-8">
                {...sidePanelBoxes}
            </div>
        }
        <div className="relative">
            <div className="absolute top-0 right-4.5 flex flex-col items-center text-center gap-3 px-10 py-4 justify-center self-center z-20 ml-5 w-64 h-64 rounded-full bg-gray-800 border-4 border-gray-300">
                <div className="text-6xl text-gray-50">{circleValue}</div>
                <div className="text-xl text-gray-200">{circleLabel}</div>
            </div>
            <div className={`w-74 mt-40 flex flex-col items-center gap-4.5 bg-gray-800 z-10 rounded-2xl shadow-lg border-4 border-gray-300 pb-11 pt-25.75`}>
                {...mainPanelBoxes}
                
            </div>
        </div>
        {!flipPanel &&
            <div className="mt-40 inline-flex gap-4 -ml-5 flex-col bg-gray-800 rounded-2xl shadow-lg border-y-4 border-r-4 border-gray-300 pl-10 pr-7 pt-6 pb-8">
                {...sidePanelBoxes}
            </div>
        }
    </div>
    );
}

export default CalculatorPanel;