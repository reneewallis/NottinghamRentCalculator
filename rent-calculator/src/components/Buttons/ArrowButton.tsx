import { ArrowButtonProps } from "@/src/types/Buttons";
import React from "react";

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  return (
    <button
      className="flex justify-center items-center border-3 rounded-full cursor-pointer border-gray-200 text-gray-200 hover:border-gray-50 hover:text-gray-50 p-1"
      onClick={onClick}
    >
      {direction === "left" ? (
        <div className="-translate-x-px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </div>
      ) : (
        <div className="translate-x-px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

export default ArrowButton;
