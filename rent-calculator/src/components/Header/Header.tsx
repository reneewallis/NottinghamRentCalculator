import React from "react";
import { HeaderProps } from "@/src/Types/Header";

function Header({children}:HeaderProps){
    return(
        <div className="max-w-full">
            <h1 className="text-3xl font-bold mb-2">Rent Calculator</h1>
            {children}
        </div>
    );
}

export default Header;