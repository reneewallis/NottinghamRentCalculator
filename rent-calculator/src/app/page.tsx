import React from "react";
import Header from "../components/Header/Header";
import Tabs from "../components/Tabs/Tabs";
import TabsProvider from "../utils/Tabs/TabsContext";
import Home from "../components/Home/Home";
import TabPanel from "../components/Tabs/TabPanel";

export default function App() {
    return (
        <div className="flex flex-col h-full w-full bg-gray-500 py-8 px-2">
            <Header></Header>
            <TabsProvider>
                <Tabs></Tabs>
                <Home></Home>
                <TabPanel></TabPanel>
            </TabsProvider>
        </div>
    );
}
