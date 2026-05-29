import { CalculatorPanelProps } from "../../types/PanelElements";
import { fluidCSSWidthScale } from "@/src/utils/helperFunctions";
import {
    CIRCLE_RIGHT_DISTANCE,
    DEFAULT_CIRCLE_SIZE,
    ELEMENT_MAX_SCALE,
    ELEMENT_MIN_SCALE,
    PANELS_MARGIN_TOP,
    MAIN_PANEL_PADDING_TOP,
    MAIN_PANEL_WIDTH,
    SIDE_PANEL_PADDING_VISIBLE_SIDE,
} from "./elementConsts";

function CalculatorPanel<TLabel extends string>({
    circleValue,
    circleLabel,
    mainPanelBoxes,
    sidePanelBoxes,
    flipPanel = false,
}: CalculatorPanelProps<TLabel>) {
    const circleSize = fluidCSSWidthScale(
        `${DEFAULT_CIRCLE_SIZE * ELEMENT_MIN_SCALE}rem`,
        `${DEFAULT_CIRCLE_SIZE}rem`,
        `${DEFAULT_CIRCLE_SIZE * ELEMENT_MAX_SCALE}rem`,
    );
    return (
        <div
            className={`inline-flex items-center ${flipPanel ? "justify-end" : "justify-start"}`}
        >
            {flipPanel && (
                <div
                    style={{
                        marginTop: fluidCSSWidthScale(
                            `${PANELS_MARGIN_TOP * ELEMENT_MIN_SCALE}rem`,
                            `${PANELS_MARGIN_TOP}rem`,
                            `${PANELS_MARGIN_TOP * ELEMENT_MAX_SCALE}rem`,
                        ),
                        paddingLeft: fluidCSSWidthScale(
                            `${SIDE_PANEL_PADDING_VISIBLE_SIDE * ELEMENT_MIN_SCALE}rem`,
                            `${SIDE_PANEL_PADDING_VISIBLE_SIDE}rem`,
                            `${SIDE_PANEL_PADDING_VISIBLE_SIDE * ELEMENT_MAX_SCALE}rem`,
                        ),
                    }}
                    className="inline-flex gap-4 -mr-5 flex-col items-start bg-gray-800 rounded-2xl shadow-lg border-y-4 border-l-4 border-gray-300 pr-10 pt-4 md:pt-5 lg:pt-6 pb-6 md:pb-7 lg:pb-8"
                >
                    {...sidePanelBoxes}
                </div>
            )}
            <div className="relative">
                <div
                    style={{
                        width: circleSize,
                        height: circleSize,
                        right: fluidCSSWidthScale(
                            `${CIRCLE_RIGHT_DISTANCE * ELEMENT_MIN_SCALE}rem`,
                            `${CIRCLE_RIGHT_DISTANCE}rem`,
                            `${CIRCLE_RIGHT_DISTANCE * ELEMENT_MAX_SCALE}rem`,
                        ),
                    }}
                    className="absolute top-0 flex flex-col items-center text-center gap-3 px-10 py-4 justify-center self-center z-20 ml-5 rounded-full bg-gray-800 border-4 border-gray-300"
                >
                    <div className="text-3xl md:text-4xl lg:text-5xl text-gray-50">
                        {circleValue}
                    </div>
                    <div className="text-lg lg:text-xl text-gray-200">
                        {circleLabel}
                    </div>
                </div>
                <div
                    style={{
                        width: fluidCSSWidthScale(
                            `${MAIN_PANEL_WIDTH * ELEMENT_MIN_SCALE}rem`,
                            `${MAIN_PANEL_WIDTH}rem`,
                            `${MAIN_PANEL_WIDTH * ELEMENT_MAX_SCALE}rem`,
                        ),
                        marginTop: fluidCSSWidthScale(
                            `${PANELS_MARGIN_TOP * ELEMENT_MIN_SCALE}rem`,
                            `${PANELS_MARGIN_TOP}rem`,
                            `${PANELS_MARGIN_TOP * ELEMENT_MAX_SCALE}rem`,
                        ),
                        paddingTop: fluidCSSWidthScale(
                            `${MAIN_PANEL_PADDING_TOP * ELEMENT_MIN_SCALE}rem`,
                            `${MAIN_PANEL_PADDING_TOP}rem`,
                            `${MAIN_PANEL_PADDING_TOP * ELEMENT_MAX_SCALE}rem`,
                        ),
                    }}
                    className={`flex flex-col items-center gap-4.5 bg-gray-800 z-10 rounded-2xl shadow-lg border-4 border-gray-300 pb-11`}
                >
                    {...mainPanelBoxes}
                </div>
            </div>
            {!flipPanel && (
                <div
                    style={{
                        marginTop: fluidCSSWidthScale(
                            `${PANELS_MARGIN_TOP * ELEMENT_MIN_SCALE}rem`,
                            `${PANELS_MARGIN_TOP}rem`,
                            `${PANELS_MARGIN_TOP * ELEMENT_MAX_SCALE}rem`,
                        ),
                        paddingRight: fluidCSSWidthScale(
                            `${SIDE_PANEL_PADDING_VISIBLE_SIDE * ELEMENT_MIN_SCALE}rem`,
                            `${SIDE_PANEL_PADDING_VISIBLE_SIDE}rem`,
                            `${SIDE_PANEL_PADDING_VISIBLE_SIDE * ELEMENT_MAX_SCALE}rem`,
                        ),
                    }}
                    className="mt-40 inline-flex gap-4 -ml-5 flex-col items-start bg-gray-800 rounded-2xl shadow-lg border-y-4 border-r-4 border-gray-300 pl-10 pt-4 md:pt-5 lg:pt-6 pb-6 md:pb-7 lg:pb-8"
                >
                    {...sidePanelBoxes}
                </div>
            )}
        </div>
    );
}

export default CalculatorPanel;
