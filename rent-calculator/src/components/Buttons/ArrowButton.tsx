import { ArrowButtonProps } from "@/src/types/Buttons";

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
    return (
        <button
            className="
              flex cursor-pointer items-center justify-center rounded-full
              border-2 border-gray-200 p-1 text-gray-200
              hover:border-gray-50 hover:text-gray-50
              lg:border-3
            "
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
                        className="
                          size-3
                          md:size-4
                          lg:size-6
                        "
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
                        className="
                          size-3
                          md:size-4
                          lg:size-6
                        "
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
