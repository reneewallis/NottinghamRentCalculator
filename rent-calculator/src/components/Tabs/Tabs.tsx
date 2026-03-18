"use client";
import React, {useReducer} from "react";
import { TabsAction, TabsActions, TabsState,} from "@/src/Types/Tabs";
import Tab from "@/src/components/Tabs/Tab"
import TabPanel from "@/src/components/Tabs/TabPanel"
import DropdownMenu from "@/src/components/Buttons/MenuButton"
import HistoryButton from "../Buttons/HistoryButton";
import NewTabButton from "../Buttons/NewTabButton";

const MAX_TABS : number = 15;

function reducer(state:TabsState, action:TabsAction): TabsState {
    switch (action.type) {
        case TabsActions.NEW_TAB: {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const time = `${hours}:${minutes}`;
            
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");

            const viewableIndex = state.wrappedTabArr.length >= MAX_TABS? state.viewableIndex + 1 : 0;

            return({
                nextTabID: state.nextTabID + 1,
                activeTab: state.wrappedTabArr.length,
                showHistory: state.showHistory,
                viewableIndex: viewableIndex,
                hoverLast: state.hoverLast,
                lastTabActive: true,
                wrappedTabArr: [...state.wrappedTabArr,
                    {
                        id: state.nextTabID,
                        time: time,
                        today: `${day}/${month}/${year}`
                    }]
            });
        }

        case TabsActions.CLOSE_TAB:{
            let activeTab = state.activeTab;
            let lastTabActive = state.lastTabActive;
            let viewableIndex = state.viewableIndex;
            let showHistory = state.showHistory;
            const newTabArr = state.wrappedTabArr.filter( (_, index) => index !== action.closeIndex)

            if (activeTab !== 0 && action.closeIndex <= activeTab){
                activeTab -= 1;
            }

            if (activeTab === newTabArr.length - 1){
                lastTabActive = true;
            }
            
            if (viewableIndex >= 1){
                if (showHistory && viewableIndex == 1) {
                    showHistory = false;
                }

                viewableIndex -= 1;
            }

            return({
                nextTabID: state.nextTabID,
                activeTab: activeTab,
                showHistory: showHistory,
                viewableIndex: viewableIndex,
                hoverLast: state.hoverLast,
                lastTabActive: lastTabActive,
                wrappedTabArr: newTabArr
            });
        }

        case TabsActions.CLOSE_ALL_TABS:{
            return({
                nextTabID: state.nextTabID,
                activeTab: 0,
                showHistory: false,
                viewableIndex: 0,
                hoverLast: false,
                lastTabActive:false,
                wrappedTabArr: []
            });
        }

        case TabsActions.HOVER_LAST:{
            return({
                nextTabID: state.nextTabID,
                activeTab: state.activeTab,
                showHistory: state.showHistory,
                viewableIndex: state.viewableIndex,
                hoverLast: action.hoverLast,
                lastTabActive: state.lastTabActive,
                wrappedTabArr: [...state.wrappedTabArr]
            });
        }

        case TabsActions.VIEW_HISTORY:{
            let showHistory = state.showHistory;

            if (showHistory){
                showHistory = false;
            }

            else if (state.viewableIndex > 0){
                showHistory = true;
            }

            return({
                nextTabID: state.nextTabID,
                activeTab: state.activeTab,
                showHistory: showHistory,
                viewableIndex: state.viewableIndex,
                hoverLast: state.hoverLast,
                lastTabActive: state.lastTabActive,
                wrappedTabArr: [...state.wrappedTabArr]
            });
        }

        case TabsActions.SET_ACTIVE_TAB:{
            return({
                nextTabID: state.nextTabID,
                activeTab: action.index,
                showHistory: state.showHistory,
                viewableIndex: state.viewableIndex,
                hoverLast: state.hoverLast,
                lastTabActive: state.lastTabActive,
                wrappedTabArr: [...state.wrappedTabArr]
            })
        }
    }
}

function initTabState(): TabsState {
    return({
        nextTabID: 0,
        activeTab: 0,
        showHistory: false,
        viewableIndex: 0,
        hoverLast: false,
        lastTabActive: false,
        wrappedTabArr: []
    })

}

export default function Tabs(){
    const [tabs, dispatch] = useReducer(reducer, null, initTabState);
    return (
    <div className="mt-2 w-full">
        <div className="flex flex-wrap items-center border-b border-gray-800">
            {tabs.wrappedTabArr.map( (wrappedTab, index) => (
                (tabs.showHistory || index >= tabs.viewableIndex) && 
                <div key = {`tabContainer${wrappedTab.id}`}onMouseEnter={()=> {if(index === tabs.wrappedTabArr.length -1){dispatch({type: TabsActions.HOVER_LAST, hoverLast:true});}}} onMouseLeave={() => {if(tabs.hoverLast){dispatch({type: TabsActions.HOVER_LAST, hoverLast:false});}}}>
                    {<Tab key={`tab${wrappedTab.id}`} label={wrappedTab.time} active={tabs.activeTab === index} onClick={() => {dispatch({type: TabsActions.SET_ACTIVE_TAB, index:index})}} onClose={() => dispatch({type: TabsActions.CLOSE_TAB, closeIndex:index})}></Tab>}
                </div>
                )
            )}
            
            {tabs.wrappedTabArr.length > 0 && 
            <div className={`flex items-center mx-0.5 h-7 mt-3 transition-colors duration-100 ${((tabs.activeTab === tabs.wrappedTabArr.length -1 || tabs.hoverLast === true)) ? "border-gray-500": "border-l-gray-800 border-l-2"}`}>
                <NewTabButton onClick={() => {dispatch({type:TabsActions.NEW_TAB})}}></NewTabButton>
                <HistoryButton showHistory={tabs.showHistory} onClick={() => {dispatch({type:TabsActions.VIEW_HISTORY})}}></HistoryButton>
                <DropdownMenu items={[{label:"Close all tabs", onClick: () => {dispatch({type:TabsActions.CLOSE_ALL_TABS})}}, {label:"Export to CSV"}, {label:"File"}, {label:"Do magic"}]} ></DropdownMenu>
            </div>
            }
        </div>
        {tabs.wrappedTabArr.length === 0?(
            <div className="flex flex-col items-center mt-20 mx-auto w-fit h-fit p-10 bg-gray-950 opacity-70 border-solid border-gray-200 border-3 inset-shadow-sm ring-2 ring-gray-100/60 rounded-2xl">
                <h1 className="font-bold text-center whitespace-nowrap text-4xl text-gray-50 text-shadow-lg/20 pt-10">Welcome to Nottigham&#39;s Rent Calculator</h1>
                <button key={"startNewTabButton"} onClick={()=>{dispatch({type: TabsActions.NEW_TAB})}} className="bg-gray-700 border-gray-50 text-gray-50 text-shadow-lg/20 text-xl border-2 inset-shadow-sm shadow-xl text-center mt-12 mb-12 p-6 rounded-full focus:outline-none transition-colors cursor-pointer duration-200 hover:text-fuchsia-700 hover:border-fuchsia-700 hover:bg-gray-800 hover:opacity-80">Create New Tab</button>
            </div>)
            :(
                tabs.wrappedTabArr.map((tab, index) => {
                    // TO:DO => return panel for non Tab Tabs
                    return(
                        <div key={`tabChild${tab.id}`} hidden={tabs.activeTab !== index}>
                            <TabPanel today={tab.today}></TabPanel>
                        </div>
                    )
                })
            )}
    </div>
  );
}