"use client";

import { MenuButtonProps } from "@/src/types/Buttons";
import { useState } from "react";
import { DEFAULT_BUTTON_SIZE } from "./buttonConsts";

function DropdownMenu({ items }: MenuButtonProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative">
            <button
                key={"menuButton"}
                style={{height: `${DEFAULT_BUTTON_SIZE}rem`, width:`${DEFAULT_BUTTON_SIZE}rem`}}
                className={
                    "flex justify-center items-center my-1 text-gray-200 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer hover:bg-fuchsia-700 hover:text-gray-50"
                }
                onClick={() => {
                    setShowMenu(!showMenu);
                }}
            >
                {showMenu ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                )}
            </button>
            {showMenu && (
                <div className="absolute right-0 p-1 z-10 inline-flex flex-col rounded-3xl bg-gray-600 inset-shadow-sm border-2 border-gray-200">
                    {items.map((menuItem, index) => (
                        <button
                            key={`item${index}`}
                            className="whitespace-nowrap pt-0.5 pb-1 pl-2 pr-2 text-left text-gray-200 rounded-2xl hover:bg-fuchsia-700 hover:text-gray-50 cursor-pointer"
                            onClick={() => {
                                if (menuItem.onClick) {
                                    menuItem.onClick();
                                }
                                setShowMenu(false);
                            }}
                        >
                            {menuItem.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownMenu;
