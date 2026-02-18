"use client";
import React, {useReducer} from "react";
import { TabProps, Panel, TabsProps, TabsAction, TabsActions, TabsState, TabsChildrenWrapper } from "@/src/Types/Tabs";
import Tab from "@/src/components/Tabs/Tab"
import TabPanel from "@/src/components/Tabs/TabPanel"
import DropdownMenu from "@/src/components/Buttons/MenuButton"
import HistoryButton from "../Buttons/HistoryButton";
import NewTabButton from "../Buttons/NewTabButton";

const MAX_TABS : number = 15;

function reducer(state:TabsState, action:TabsAction): TabsState {
    switch (action.type) {
        case TabsActions.NEW_TAB: {
            const newPanel : Panel = 
            // {
            //     paragraph:`The content will be displayed here, tab ${tabID} for now we have this and lets make it different for each tab somehow, this is 18:36 we like that time a lot`
            //   }

            // {
            //     paragraph:"As you can see this text is very different from the previous text, maybe even a bit longer so I can see how this box looks on longer text, on much longer text and medium text. I don/'t know how long this text is but it should be long enough about now. Maybe I should stop typing, maybe not. Edge cases are very important but this may not be long enough. Maybe we could just ramble a little longer. Maybe I could start writing a book."
            //   }

            // {
            //     paragraph:"We are fast approcahing the lorem paragraph. I actually do not know latin."
            // }
            {
            paragraph:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu nibh diam. Duis rutrum mauris neque, in tempor elit tempus non. Proin posuere, neque at faucibus auctor, ante tortor ornare eros, ac sollicitudin metus augue ut nisl. Curabitur interdum risus erat, sit amet ultricies urna volutpat ac. Aenean blandit, leo vitae suscipit fringilla, tellus orci blandit augue, sed varius tellus metus eget purus. Nullam tincidunt, erat nec tincidunt dignissim, diam purus rutrum nulla, non molestie risus ligula vel dui. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi suscipit quis odio vitae scelerisque. Fusce sed sollicitudin justo, et ultricies nunc. Mauris diam sapien, placerat sit amet enim eu, volutpat viverra tortor. Aliquam diam purus, lobortis nec auctor ut, consequat eu diam. Vestibulum id fringilla orci. Morbi nunc massa, blandit sed elementum at, efficitur sit amet lectus. Pellentesque cursus ipsum augue, nec accumsan quam suscipit id. Aliquam nec magna vitae felis rhoncus porta. In blandit neque ut ligula facilisis, eu mattis nisl sollicitudin. Suspendisse vitae pellentesque massa, vel gravida quam. Suspendisse suscipit massa libero, vitae maximus elit elementum vitae. Vestibulum ipsum orci, convallis vel ipsum eget, mattis condimentum sem. Cras vestibulum nisl sed diam efficitur blandit. Phasellus malesuada maximus dictum. Integer tincidunt, massa viverra efficitur ultricies, libero odio mattis augue, eu malesuada elit nisi eget magna. Fusce semper, metus a volutpat pretium, erat tellus ornare ante, a efficitur mauris sapien non sapien. Mauris ut mattis nisl, vitae volutpat velit. In at justo vitae felis dignissim luctus sit amet non arcu. Fusce tincidunt purus a tempor posuere. Vivamus pulvinar ornare mattis. Suspendisse aliquet rhoncus eros, ut fermentum sapien gravida scelerisque. Donec consequat ac nulla eu congue. Vestibulum vel quam convallis, eleifend sapien congue, ornare tortor. Ut facilisis pretium ex eu facilisis. Morbi varius est a suscipit aliquam. Aenean pellentesque volutpat nibh, eget laoreet nulla consequat et. Maecenas quis nisi dui. Aliquam consectetur libero et sem viverra, ut molestie mi gravida. Proin tristique pharetra urna, at feugiat arcu consectetur eget. Nam rhoncus euismod leo, id consequat diam egestas sed. Fusce finibus, tortor et feugiat rutrum, eros dui rhoncus magna, et efficitur metus libero ac elit. In ornare nisl quis scelerisque feugiat. Quisque in erat sed velit ultricies tincidunt. Nulla eleifend et ipsum sit amet sodales. Etiam eget congue metus, sit amet semper mi. Quisque ut nibh nisl. Donec eget vehicula turpis. Vestibulum eget hendrerit ligula, nec maximus ipsum. Integer condimentum augue nulla, nec ultricies risus aliquam nec. Suspendisse vel enim fermentum dolor venenatis imperdiet. Curabitur eget consequat nunc, ut malesuada nisl. Pellentesque nec neque gravida, tincidunt sem ac, vulputate enim. Mauris lobortis, ante at tristique blandit, lacus lacus venenatis nisl, at interdum enim diam sodales purus. Sed tellus justo, convallis eu tincidunt quis, ullamcorper venenatis metus. Proin egestas elit ac placerat pellentesque. Mauris ornare, justo rhoncus mollis ultrices, risus eros mollis libero, eu convallis enim turpis malesuada magna. Praesent consectetur sagittis risus, in faucibus justo laoreet eu."
            };

            const viewableIndex = state.children.length >= MAX_TABS? state.viewableIndex + 1 : 0;

            return({
                nextTabID: state.nextTabID + 1,
                activeTab: state.children.length,
                showHistory: state.showHistory,
                viewableIndex: viewableIndex,
                hoverLast: state.hoverLast,
                lastTabActive: true,
                children: [...state.children,
                    {
                        isTab: true,
                        id: state.nextTabID,
                        node: <Tab label="18:36"><TabPanel content={newPanel}></TabPanel></Tab>
                    }]
            });
        }

        case TabsActions.CLOSE_TAB:{
            let activeTab = state.activeTab;
            let lastTabActive = state.lastTabActive;
            let viewableIndex = state.viewableIndex;
            let showHistory = state.showHistory;
            const childArr = state.children.filter( (_, index) => index !== action.closeIndex)

            if (activeTab !== 0 && action.closeIndex <= activeTab){
                activeTab -= 1;
            }

            if (activeTab === childArr.length - 1){
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
                children: childArr
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
                children: []
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
                children: [...state.children]
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
                children: [...state.children]
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
                children: [...state.children]
            })
        }
    }
}

function isTabElement(element: React.ReactNode): element is React.ReactElement<TabProps> {
  return React.isValidElement(element) && element.type === Tab;
}

function initTabState(children:React.ReactNode): TabsState {
    let nextID = 0;
    const childArr: TabsChildrenWrapper[] = React.Children.toArray(children)
        .map(child => {
            if (isTabElement(child)){
                return({
                    isTab: true,
                    id: nextID++,
                    node: child
                })
            }

            else{
                return({
                    isTab:false,
                    id: nextID++,
                    node: child
                })
            }
        });
    
    return({
        nextTabID: nextID,
        activeTab: 0,
        showHistory: false,
        viewableIndex: 0,
        hoverLast: false,
        lastTabActive: childArr.length === 1,
        children: childArr
    })

}

export default function Tabs({children}:TabsProps){
    const [tabs, dispatch] = useReducer(reducer,children, initTabState);
    return (
    <div>
        <div className="flex flex-wrap w-full items-center border-b border-gray-800">
            {tabs.children.map( (wrappedChild, index) => (
                (tabs.showHistory || index >= tabs.viewableIndex) && 
                <div key = {`tabContainer${wrappedChild.id}`}onMouseEnter={()=> {if(index === tabs.children.length -1){dispatch({type: TabsActions.HOVER_LAST, hoverLast:true});}}} onMouseLeave={() => {if(tabs.hoverLast){dispatch({type: TabsActions.HOVER_LAST, hoverLast:false});}}}>
                    {wrappedChild.isTab? 
                    <Tab key={`tab${wrappedChild.id}`} label={wrappedChild.node.props.label} active={tabs.activeTab === index} onClick={() => {dispatch({type: TabsActions.SET_ACTIVE_TAB, index:index})}} onClose={() => dispatch({type: TabsActions.CLOSE_TAB, closeIndex:index})}></Tab>
                    :
                    <div key={`tabsChild${wrappedChild.id}`}>{wrappedChild.node}</div>
                    }
                </div>
                )
            )}
            
            {tabs.children.length > 0 && 
            <div className={`flex items-center mx-0.5 h-7 mt-3 transition-colors duration-100 ${((tabs.activeTab === tabs.children.length -1 || tabs.hoverLast === true)) ? "border-gray-500": "border-l-gray-800 border-l-2"}`}>
                <NewTabButton onClick={() => {dispatch({type:TabsActions.NEW_TAB})}}></NewTabButton>
                <HistoryButton showHistory={tabs.showHistory} onClick={() => {dispatch({type:TabsActions.VIEW_HISTORY})}}></HistoryButton>
                <DropdownMenu items={[{label:"Close all tabs", onClick: () => {dispatch({type:TabsActions.CLOSE_ALL_TABS})}}, {label:"Export to CSV"}, {label:"File"}, {label:"Do magic"}]} ></DropdownMenu>
            </div>
            }
        </div>
        {tabs.children.length === 0?(
            <div className="flex flex-col items-center mt-20 mx-auto w-fit h-fit p-10 bg-gray-950 opacity-70 border-solid border-gray-200 border-3 inset-shadow-sm ring-2 ring-gray-100/60 rounded-2xl">
                <h1 className="font-bold text-center whitespace-nowrap text-4xl text-gray-50 text-shadow-lg/20 pt-10">Welcome to Nottigham&#39;s Rent Calculator</h1>
                <button key={"startNewTabButton"} onClick={()=>{dispatch({type: TabsActions.NEW_TAB})}} className="bg-gray-700 border-gray-50 text-gray-50 text-shadow-lg/20 text-xl border-2 inset-shadow-sm shadow-xl text-center mt-12 mb-12 p-6 rounded-full focus:outline-none transition-colors cursor-pointer duration-200 hover:text-fuchsia-700 hover:border-fuchsia-700 hover:bg-gray-800 hover:opacity-80">Create New Tab</button>
            </div>)
            :(
                tabs.children.map((child, index) => {
                    if (!child.isTab){
                        return null;
                    }

                    return(
                        <div key={`tabChild${child.id}`} hidden={tabs.activeTab !== index}>
                            {child.node.props.children}
                        </div>
                    )
                })
            )}
    </div>
  );
}