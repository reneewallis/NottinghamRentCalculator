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
            className={`inline-flex justify-between items-center mt-2 rounded-t-lg focus:outline-none transition-colors font-medium text-sm duration-200 ${active ? "border-b-2  border-b-gray-800 text-gray-200 bg-gray-600" : "text-gray-300 hover:text-fuchsia-700 border-b-2 border-b-gray-500 hover:border-b-gray-800 hover:bg-gray-800 hover:opacity-90"}`}
        >
            <button
                style={{
                    width: `${label.length * TAB_TEXT_WIDTH + TAB_PADDING_LEFT + TAB_PADDING_RIGHT}rem`,
                    paddingLeft: `${TAB_PADDING_LEFT}rem`,
                    paddingRight: `${TAB_PADDING_RIGHT}rem`,
                }}
                className={
                    "text-left py-3 cursor-pointer transition-colors duration-200 focus:outline-none overflow-clip"
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
                    "flex justify-center items-center my-2 rounded-full font-semibold text-center cursor-pointer transition-colors duration-200 focus:outline-none hover:bg-fuchsia-700 hover:text-gray-50"
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
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}

export default Tab;
