"use client";

import { useState } from "react";

import { MenuButtonProps } from "@/src/types/Buttons";

import { DEFAULT_BUTTON_SIZE } from "./buttonConsts";

function DropdownMenu({ items }: MenuButtonProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative">
            <button
                key={"menuButton"}
                style={{
                    height: `${DEFAULT_BUTTON_SIZE}rem`,
                    width: `${DEFAULT_BUTTON_SIZE}rem`,
                }}
                className={`
                  my-1 flex cursor-pointer items-center justify-center
                  rounded-full text-gray-200 transition-colors duration-200
                  hover:bg-fuchsia-700 hover:text-gray-50
                  focus:outline-none
                `}
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
                <div
                    className="
                      absolute right-0 z-50 inline-flex flex-col rounded-3xl
                      border-2 border-gray-200 bg-gray-600 p-1 inset-shadow-sm
                    "
                >
                    {items.map((menuItem, index) => (
                        <button
                            key={`item-${menuItem.label}-${menuItem.id ?? index}`}
                            className="
                              cursor-pointer rounded-2xl px-2 pt-0.5 pb-1
                              text-left whitespace-nowrap text-gray-200
                              hover:bg-fuchsia-700 hover:text-gray-50
                            "
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
