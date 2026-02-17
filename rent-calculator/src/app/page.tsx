import React from "react";
import Header from "@/src/components/Header/Header";
import Tabs from "@/src/components/Tabs/Tabs";

export default function Home() {
  return (
  <div className="min-h-screen bg-gray-500 p-8 text-gray-50">
    <Header></Header>
    <Tabs></Tabs>
  </div>
  );
}
