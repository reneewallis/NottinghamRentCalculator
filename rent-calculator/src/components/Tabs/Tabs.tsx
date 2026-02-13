"use client";

import React, {useState} from "react";
import { Tab, Content} from "@/src/Types/Tab";

function Tabs() {
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [hoverLast, setHoverLast] = useState(false);
    
    const viewableIndex: number = tabs.length - 15;

    const createNewTab = () => {
        const newTab : Tab = 
    {
      label:"18:36",
      id: tabs.length,
      content: {
        paragraph:`The content will be displayed here, tab ${tabs.length} for now we have this and lets make it different for each tab somehow, this is 18:36 we like that time a lot`
      }
    };

    //  {
    //   label:"18:47",
    //   content: {
    //     paragraph:"As you can see this text is very different from the previous text, maybe even a bit longer so I can see how this box looks on longer text, on much longer text and medium text. I don/'t know how long this text is but it should be long enough about now. Maybe I should stop typing, maybe not. Edge cases are very important but this may not be long enough. Maybe we could just ramble a little longer. Maybe I could start writing a book."
    //   }
    // },

    //  {
    //   label:"19:08",
    //   content: {
    //     paragraph:"We are fast approcahing the lorem paragraph. I actually do not know latin."
    //   }
    // },

    //  {
    //   label:"20:32",
    //   content: {
    //     paragraph:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu nibh diam. Duis rutrum mauris neque, in tempor elit tempus non. Proin posuere, neque at faucibus auctor, ante tortor ornare eros, ac sollicitudin metus augue ut nisl. Curabitur interdum risus erat, sit amet ultricies urna volutpat ac. Aenean blandit, leo vitae suscipit fringilla, tellus orci blandit augue, sed varius tellus metus eget purus. Nullam tincidunt, erat nec tincidunt dignissim, diam purus rutrum nulla, non molestie risus ligula vel dui. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi suscipit quis odio vitae scelerisque. Fusce sed sollicitudin justo, et ultricies nunc. Mauris diam sapien, placerat sit amet enim eu, volutpat viverra tortor. Aliquam diam purus, lobortis nec auctor ut, consequat eu diam. Vestibulum id fringilla orci. Morbi nunc massa, blandit sed elementum at, efficitur sit amet lectus. Pellentesque cursus ipsum augue, nec accumsan quam suscipit id. Aliquam nec magna vitae felis rhoncus porta. In blandit neque ut ligula facilisis, eu mattis nisl sollicitudin. Suspendisse vitae pellentesque massa, vel gravida quam. Suspendisse suscipit massa libero, vitae maximus elit elementum vitae. Vestibulum ipsum orci, convallis vel ipsum eget, mattis condimentum sem. Cras vestibulum nisl sed diam efficitur blandit. Phasellus malesuada maximus dictum. Integer tincidunt, massa viverra efficitur ultricies, libero odio mattis augue, eu malesuada elit nisi eget magna. Fusce semper, metus a volutpat pretium, erat tellus ornare ante, a efficitur mauris sapien non sapien. Mauris ut mattis nisl, vitae volutpat velit. In at justo vitae felis dignissim luctus sit amet non arcu. Fusce tincidunt purus a tempor posuere. Vivamus pulvinar ornare mattis. Suspendisse aliquet rhoncus eros, ut fermentum sapien gravida scelerisque. Donec consequat ac nulla eu congue. Vestibulum vel quam convallis, eleifend sapien congue, ornare tortor. Ut facilisis pretium ex eu facilisis. Morbi varius est a suscipit aliquam. Aenean pellentesque volutpat nibh, eget laoreet nulla consequat et. Maecenas quis nisi dui. Aliquam consectetur libero et sem viverra, ut molestie mi gravida. Proin tristique pharetra urna, at feugiat arcu consectetur eget. Nam rhoncus euismod leo, id consequat diam egestas sed. Fusce finibus, tortor et feugiat rutrum, eros dui rhoncus magna, et efficitur metus libero ac elit. In ornare nisl quis scelerisque feugiat. Quisque in erat sed velit ultricies tincidunt. Nulla eleifend et ipsum sit amet sodales. Etiam eget congue metus, sit amet semper mi. Quisque ut nibh nisl. Donec eget vehicula turpis. Vestibulum eget hendrerit ligula, nec maximus ipsum. Integer condimentum augue nulla, nec ultricies risus aliquam nec. Suspendisse vel enim fermentum dolor venenatis imperdiet. Curabitur eget consequat nunc, ut malesuada nisl. Pellentesque nec neque gravida, tincidunt sem ac, vulputate enim. Mauris lobortis, ante at tristique blandit, lacus lacus venenatis nisl, at interdum enim diam sodales purus. Sed tellus justo, convallis eu tincidunt quis, ullamcorper venenatis metus. Proin egestas elit ac placerat pellentesque. Mauris ornare, justo rhoncus mollis ultrices, risus eros mollis libero, eu convallis enim turpis malesuada magna. Praesent consectetur sagittis risus, in faucibus justo laoreet eu."
    //   }
    // }
    // ];

    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length)
    }

    const closeTab = (closedIndex:number) => {
       const tabArr = tabs.filter((_, index) => index !== closedIndex)
       setTabs(tabArr)

    }

    const renderContent = (content:Content) => {
        return(
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-2 border border-gray-700">
                <p className="text-gray-300">{content.paragraph}</p>
            </div>
        );
    }

    const renderEmpty = () => {
        return(
            <div className="flex flex-col items-center mt-20 p-10 bg-gray-800 border-solid border-gray-200 border-6 inset-shadow-sm inset-shadow-gray-700/100 mx-40 rounded-2xl">
                <h1 className="font-bold text-center text-4xl text-gray-50 pt-10">Welcome to Nottigham&#39;s Rent Calculator</h1>
                <button onClick={createNewTab} className="bg-gray-600 border-gray-200 text-gray-200 text-xl border-2 shadow-xl shadow-gray-700 text-center mt-12 mb-12 p-6 rounded-full focus:outline-none transition-colors cursor-pointer duration-200 hover:text-fuchsia-700 hover:border-fuchsia-700 hover:bg-gray-700 hover:bg-opacity-30" key={"startNewTabButton"}>Create New Tab</button>
            </div>
        )
    }

    return (
    <div className="max-w-full">
        <div className="flex flex-wrap border-b border-gray-800">
            {tabs.map((tab : Tab) => (
            (tab.id >= viewableIndex) && <div key = {`tab${tab.id}`} className={`flex justify-between mt-2 rounded-t-lg focus:outline-none transition-colors font-medium text-sm duration-200 ${activeTab === tab.id ? "border-b-2  border-b-gray-800 text-gray-400 bg-gray-600 bg-opacity-50": "text-gray-300 hover:text-fuchsia-700 hover:bg-gray-800 hover:bg-opacity-30"}`}>
                    <button className={"py-3 pl-4 pr-1.5 cursor-pointer"} key = {`button${tab.id}`} onClick = {() => setActiveTab(tab.id)} onMouseEnter={()=> {if(tab.id === tabs.length -1){setHoverLast(true);}}} onMouseLeave={() => {if(hoverLast){setHoverLast(false);}}}>{tab.label}</button>
                    <button className={"flex justify-center items-center w-6 h-6 py-4 my-2 mx-1 rounded-full font-semibold  text-center cursor-pointer hover:bg-fuchsia-700 hover:bg-opacity-30 hover:text-gray-50"}>X</button>
            </div>
        ))}

            <div className={`flex ml-0.5 h-1/4 translate-y-1/3 transition-colors duration-100 items-center ${(activeTab != tabs.length -1 && hoverLast === false) ? "border-l-gray-800 border-l-2" : "border-gray-500"}`}>
                {tabs.length > 0 && <button className={"text-2xl text-gray-50 text-center px-3 pb-1 mx-0.5 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer hover:bg-gray-600 bg-opacity-30"} key={"newTabButton"} onClick={createNewTab}>+</button>}
            </div>
        </div>
        <div className="mt-3">{tabs[activeTab] ? renderContent(tabs[activeTab].content) : renderEmpty()}</div>
    </div>
    );
};

export default Tabs;