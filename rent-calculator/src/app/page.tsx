import React from "react";

import Header from "../components/Header/Header";
import Home from "../components/Home/Home";
import TabPanel from "../components/Tabs/TabPanel";
import Tabs from "../components/Tabs/Tabs";
import TabsProvider from "../utils/Tabs/TabsContext";

export default function App() {
    return (
        <div className="flex min-h-screen w-fit min-w-screen flex-col p-2">
            <Header></Header>
            <TabsProvider>
                <Tabs></Tabs>
                <Home></Home>
                <TabPanel></TabPanel>
            </TabsProvider>
        </div>
    );
}
