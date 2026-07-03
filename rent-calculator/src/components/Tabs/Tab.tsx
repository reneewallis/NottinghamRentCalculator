import { TabProps } from "../../types/Tabs";
import {
    TAB_CLOSE_BUTTON_MARGIN_X,
    TAB_CLOSE_BUTTON_SIZE,
    TAB_PADDING_LEFT,
    TAB_PADDING_RIGHT,
    TAB_TEXT_WIDTH,
} from "./tabConsts";

function Tab({ label, active = false, onClick, onClose }: TabProps) {
    return (
        <div
            className={`
              mt-2 inline-flex items-center justify-between rounded-t-lg text-sm
              font-medium transition-colors duration-200
              focus:outline-none
              ${active ? `
                border-b-2 border-b-gray-800 bg-gray-600 text-gray-200
              ` : `
                border-b-2 border-b-gray-500 text-gray-300
                hover:border-b-gray-800 hover:bg-gray-800 hover:text-fuchsia-700
                hover:opacity-90
              `}
            `}
        >
            <button
                style={{
                    width: `${label.length * TAB_TEXT_WIDTH + TAB_PADDING_LEFT + TAB_PADDING_RIGHT}rem`,
                    paddingLeft: `${TAB_PADDING_LEFT}rem`,
                    paddingRight: `${TAB_PADDING_RIGHT}rem`,
                }}
                className={
                    `
                      cursor-pointer overflow-clip py-3 text-left
                      transition-colors duration-200
                      focus:outline-none
                    `
                }
                {...(onClick && { onClick: onClick })}
            >
                {label}
            </button>
            <button
                style={{
                    width: `${TAB_CLOSE_BUTTON_SIZE}rem`,
                    height: `${TAB_CLOSE_BUTTON_SIZE}rem`,
                    marginInline: `${TAB_CLOSE_BUTTON_MARGIN_X}rem`,
                }}
                className={
                    `
                      my-2 flex cursor-pointer items-center justify-center
                      rounded-full text-center font-semibold transition-colors
                      duration-200
                      hover:bg-fuchsia-700 hover:text-gray-50
                      focus:outline-none
                    `
                }
                {...(onClose && { onClick: onClose })}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export default Tab;
