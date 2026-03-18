import React from "react";
import Header from "@/src/components/Header/Header";
import Tabs from "@/src/components/Tabs/Tabs";

export default function Home() {
  return (
  <div className="flex flex-col min-h-screen w-full bg-gray-500 py-8 px-2">
    <Header></Header>
    <Tabs></Tabs>
  </div>
  );
}
