"use client";

import React, {useState} from "react";
import {Tab} from "@/src/Types/Tab";
import TabPanel from "./TabPanel";
import DropdownMenu from "@/src/components/Dropdown/DropdownMenu"

function Tabs() {
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [tabID, setTabID] = useState(1);
    const [viewableIndex, setViewableIndex] = useState(0);
    const [hoverLast, setHoverLast] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const MAX_TABS : number = 15;

    const createNewTab = () => {
        const newTab : Tab = 
    // {
    //   label:"18:36",
    //   id: tabID,
    //   content: {
    //     paragraph:`The content will be displayed here, tab ${tabID} for now we have this and lets make it different for each tab somehow, this is 18:36 we like that time a lot`
    //   }
    // };

    //  {
    //   label:"18:47",
    //   id: tabID,
    //   content: {
    //     paragraph:"As you can see this text is very different from the previous text, maybe even a bit longer so I can see how this box looks on longer text, on much longer text and medium text. I don/'t know how long this text is but it should be long enough about now. Maybe I should stop typing, maybe not. Edge cases are very important but this may not be long enough. Maybe we could just ramble a little longer. Maybe I could start writing a book."
    //   }
    // },

    //  {
    //   label:"19:08",
    //   id: tabID,
    //   content: {
    //     paragraph:"We are fast approcahing the lorem paragraph. I actually do not know latin."
    //   }
    // },

     {
      label:"20:32",
      id: tabID,
      content: {
        paragraph:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu nibh diam. Duis rutrum mauris neque, in tempor elit tempus non. Proin posuere, neque at faucibus auctor, ante tortor ornare eros, ac sollicitudin metus augue ut nisl. Curabitur interdum risus erat, sit amet ultricies urna volutpat ac. Aenean blandit, leo vitae suscipit fringilla, tellus orci blandit augue, sed varius tellus metus eget purus. Nullam tincidunt, erat nec tincidunt dignissim, diam purus rutrum nulla, non molestie risus ligula vel dui. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi suscipit quis odio vitae scelerisque. Fusce sed sollicitudin justo, et ultricies nunc. Mauris diam sapien, placerat sit amet enim eu, volutpat viverra tortor. Aliquam diam purus, lobortis nec auctor ut, consequat eu diam. Vestibulum id fringilla orci. Morbi nunc massa, blandit sed elementum at, efficitur sit amet lectus. Pellentesque cursus ipsum augue, nec accumsan quam suscipit id. Aliquam nec magna vitae felis rhoncus porta. In blandit neque ut ligula facilisis, eu mattis nisl sollicitudin. Suspendisse vitae pellentesque massa, vel gravida quam. Suspendisse suscipit massa libero, vitae maximus elit elementum vitae. Vestibulum ipsum orci, convallis vel ipsum eget, mattis condimentum sem. Cras vestibulum nisl sed diam efficitur blandit. Phasellus malesuada maximus dictum. Integer tincidunt, massa viverra efficitur ultricies, libero odio mattis augue, eu malesuada elit nisi eget magna. Fusce semper, metus a volutpat pretium, erat tellus ornare ante, a efficitur mauris sapien non sapien. Mauris ut mattis nisl, vitae volutpat velit. In at justo vitae felis dignissim luctus sit amet non arcu. Fusce tincidunt purus a tempor posuere. Vivamus pulvinar ornare mattis. Suspendisse aliquet rhoncus eros, ut fermentum sapien gravida scelerisque. Donec consequat ac nulla eu congue. Vestibulum vel quam convallis, eleifend sapien congue, ornare tortor. Ut facilisis pretium ex eu facilisis. Morbi varius est a suscipit aliquam. Aenean pellentesque volutpat nibh, eget laoreet nulla consequat et. Maecenas quis nisi dui. Aliquam consectetur libero et sem viverra, ut molestie mi gravida. Proin tristique pharetra urna, at feugiat arcu consectetur eget. Nam rhoncus euismod leo, id consequat diam egestas sed. Fusce finibus, tortor et feugiat rutrum, eros dui rhoncus magna, et efficitur metus libero ac elit. In ornare nisl quis scelerisque feugiat. Quisque in erat sed velit ultricies tincidunt. Nulla eleifend et ipsum sit amet sodales. Etiam eget congue metus, sit amet semper mi. Quisque ut nibh nisl. Donec eget vehicula turpis. Vestibulum eget hendrerit ligula, nec maximus ipsum. Integer condimentum augue nulla, nec ultricies risus aliquam nec. Suspendisse vel enim fermentum dolor venenatis imperdiet. Curabitur eget consequat nunc, ut malesuada nisl. Pellentesque nec neque gravida, tincidunt sem ac, vulputate enim. Mauris lobortis, ante at tristique blandit, lacus lacus venenatis nisl, at interdum enim diam sodales purus. Sed tellus justo, convallis eu tincidunt quis, ullamcorper venenatis metus. Proin egestas elit ac placerat pellentesque. Mauris ornare, justo rhoncus mollis ultrices, risus eros mollis libero, eu convallis enim turpis malesuada magna. Praesent consectetur sagittis risus, in faucibus justo laoreet eu."
      }
    }
    // ];

    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
    setTabID(tabID+1);

    if (tabs.length >= MAX_TABS){
        setViewableIndex(viewableIndex+1);
    }
    }

    const closeTab = (closedIndex:number) => {
        if (activeTab !== 0 && closedIndex <= activeTab){
            setActiveTab(activeTab-1);
        }

        if (hoverLast && activeTab !== tabs.length - 1){
            setHoverLast(false);
        }

        const tabArr = tabs.filter((_, index:number) => index!== closedIndex);
        setTabs(tabArr);

        if (viewableIndex >= 1){
            if (showHistory && viewableIndex == 1) {
                setShowHistory(false);
            }

            setViewableIndex(viewableIndex-1);
        }
    }

    const closeAllTabs = () => {
        setActiveTab(0);
        setViewableIndex(0);
        setHoverLast(false);
        setShowHistory(false);
        setTabs([]);
    }

    const viewHistory = () => {
        if (showHistory){
            setShowHistory(false);
        }

        else if (viewableIndex>0){
            setShowHistory(true);
        }
    }

    const renderEmpty = () => {
        return(
            <div className="flex flex-col items-center mt-20 p-10 bg-gray-950 opacity-70 border-solid border-gray-200 border-3 inset-shadow-sm ring-2 ring-gray-100/60 mx-40 rounded-2xl">
                <h1 className="font-bold text-center text-4xl text-gray-50 text-shadow-lg/20 pt-10">Welcome to Nottigham&#39;s Rent Calculator</h1>
                <button key={"startNewTabButton"} onClick={createNewTab} className="bg-gray-700 border-gray-50 text-gray-50 text-shadow-lg/20 text-xl border-2 inset-shadow-sm shadow-xl text-center mt-12 mb-12 p-6 rounded-full focus:outline-none transition-colors cursor-pointer duration-200 hover:text-fuchsia-700 hover:border-fuchsia-700 hover:bg-gray-800 hover:bg-opacity-30">Create New Tab</button>
            </div>
        )
    }

    return (
    <div className="max-w-full">
        <div className="flex flex-wrap items-center border-b border-gray-800">
            {tabs.map((tab : Tab, index:number) => (
            (showHistory? true: index >= viewableIndex) && <div key = {`tab${index}`} className={`flex justify-between items-center mt-2 rounded-t-lg focus:outline-none transition-colors font-medium text-sm duration-200 ${activeTab === index ? "border-b-2  border-b-gray-800 text-gray-200 bg-gray-600 bg-opacity-50": "text-gray-300 hover:text-fuchsia-700 hover:bg-gray-800 hover:bg-opacity-30"}`} onMouseEnter={()=> {if(index === tabs.length -1){setHoverLast(true);}}} onMouseLeave={() => {if(hoverLast){setHoverLast(false);}}}>
                    <button key = {`tabButton${index}`} className={"py-3 pl-4 pr-1.5 cursor-pointer transition-colors duration-200"} onClick = {() => setActiveTab(index)}>{tab.label}</button>
                    <button key={`closeButton${index}`} className={"flex justify-center items-center w-6 h-6 my-2 mx-0.5 rounded-full font-semibold  text-center cursor-pointer transition-colors duration-200 hover:bg-fuchsia-700 hover:bg-opacity-30 hover:text-gray-50"} onClick={() => closeTab(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
            </div>
        ))}

            {tabs.length > 0 && <div className={`flex items-center mx-0.5 h-7 mt-3 transition-colors duration-100 ${((activeTab === tabs.length -1 || hoverLast === true)) ? "border-gray-500": "border-l-gray-800 border-l-2"}`}>
                <button  key={"newTabButton"} className={"flex justify-center items-center h-9 w-9 my-1 text-gray-200 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer hover:bg-fuchsia-700 hover:text-gray-50 bg-opacity-30"} onClick={createNewTab}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.25} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
                <button key={"historyButton"} className={"flex justify-center items-center h-9 w-9 my-1 text-gray-200 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer hover:bg-fuchsia-700 hover:text-gray-50 bg-opacity-30"} onClick={viewHistory}>
                    {showHistory? 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        :
                        <svg  xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill={"currentColor"} viewBox={"0 0 24 24"}>
                            <path d="M21.21 8.11c-.25-.59-.56-1.16-.92-1.7-.36-.53-.77-1.03-1.22-1.48s-.95-.86-1.48-1.22c-.54-.36-1.11-.67-1.7-.92-.6-.26-1.24-.45-1.88-.58-1.31-.27-2.72-.27-4.03 0-.64.13-1.27.33-1.88.58-.59.25-1.16.56-1.7.92-.53.36-1.03.77-1.48 1.22-.17.17-.32.35-.48.52L1.99 3v6h6L5.86 6.87c.15-.18.31-.36.48-.52.36-.36.76-.69 1.18-.98.43-.29.89-.54 1.36-.74.48-.2.99-.36 1.5-.47 1.05-.21 2.18-.21 3.23 0 .51.11 1.02.26 1.5.47.47.2.93.45 1.36.74.42.29.82.62 1.18.98s.69.76.98 1.18c.29.43.54.89.74 1.36.2.48.36.99.47 1.5.11.53.16 1.07.16 1.61a7.85 7.85 0 0 1-.63 3.11c-.2.47-.45.93-.74 1.36-.29.42-.62.82-.98 1.18s-.76.69-1.18.98c-.43.29-.89.54-1.36.74-.48.2-.99.36-1.5.47-1.05.21-2.18.21-3.23 0a8 8 0 0 1-1.5-.47c-.47-.2-.93-.45-1.36-.74-.42-.29-.82-.62-1.18-.98s-.69-.76-.98-1.18c-.29-.43-.54-.89-.74-1.36-.2-.48-.36-.99-.47-1.5A8 8 0 0 1 3.99 12h-2c0 .68.07 1.35.2 2.01.13.64.33 1.27.58 1.88.25.59.56 1.16.92 1.7.36.53.77 1.03 1.22 1.48s.95.86 1.48 1.22c.54.36 1.11.67 1.7.92.6.26 1.24.45 1.88.58.66.13 1.33.2 2.01.2s1.36-.07 2.01-.2c.64-.13 1.27-.33 1.88-.58.59-.25 1.16-.56 1.7-.92.53-.36 1.03-.77 1.48-1.22s.86-.95 1.22-1.48c.36-.54.67-1.11.92-1.7.26-.6.45-1.24.58-1.88.13-.66.2-1.34.2-2.01s-.07-1.35-.2-2.01c-.13-.64-.33-1.27-.58-1.88Z"/><path d="M11 7v6h6v-2h-4V7z"/>
                        </svg>}
                </button>
                <DropdownMenu items={[{label:"Close all tabs", onClick: closeAllTabs}]} ></DropdownMenu>
            </div>}
        </div>
        <div className="mt-3">{tabs[activeTab] ? <TabPanel content={tabs[activeTab].content}></TabPanel>: renderEmpty()}</div>
    </div>
    );
};

export default Tabs;