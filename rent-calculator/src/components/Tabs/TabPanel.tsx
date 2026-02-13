"use client";

import React from "react";
import {PanelProps} from "@/src/Types/Tab";

function TabPanel({content}:PanelProps){
    return (<div className="p-6 bg-gray-950 opacity-70 rounded-lg shadow-lg mt-2 border-2 border-gray-50">
                <p className="text-gray-50">{content.paragraph}</p>
            </div>)
}

export default TabPanel