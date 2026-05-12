import React from "react";
import { HeaderProps } from "@/src/types/Header";

function Header({ children }: HeaderProps) {
    return (
        <div className="flex flex-row w-full">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-200">
                Rent Calculator
            </h1>
            {children}
        </div>
    );
}

export default Header;
