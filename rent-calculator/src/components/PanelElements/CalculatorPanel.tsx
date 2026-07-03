import { fluidCSSWidthScale } from "@/src/utils/helperFunctions";

import { CalculatorPanelProps } from "../../types/PanelElements";
import {
    CIRCLE_RIGHT_DISTANCE,
    DEFAULT_CIRCLE_SIZE,
    ELEMENT_MAX_SCALE,
    ELEMENT_MIN_SCALE,
    MAIN_PANEL_PADDING_TOP,
    MAIN_PANEL_WIDTH,
    PANELS_MARGIN_TOP,
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
        <div className={`
          inline-flex items-center
          ${flipPanel ? "justify-end" : `justify-start`}
        `}>
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
                    className="
                      -mr-5 inline-flex flex-col items-start gap-4 rounded-2xl
                      border-y-4 border-l-4 border-gray-300 bg-gray-800 pt-4
                      pr-10 pb-6 shadow-lg
                      md:pt-5 md:pb-7
                      lg:pt-6 lg:pb-8
                    "
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
                    className="
                      absolute top-0 z-20 ml-5 flex flex-col items-center
                      justify-center gap-3 self-center rounded-full border-4
                      border-gray-300 bg-gray-800 px-10 py-4 text-center
                    "
                >
                    <div className="
                      text-3xl text-gray-50
                      md:text-4xl
                      lg:text-5xl
                    ">
                        {circleValue}
                    </div>
                    <div className="
                      text-lg text-gray-200
                      lg:text-xl
                    ">{circleLabel}</div>
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
                    className={`
                      z-10 flex flex-col items-center gap-4.5 rounded-2xl
                      border-4 border-gray-300 bg-gray-800 pb-11 shadow-lg
                    `}
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
                    className="
                      mt-40 -ml-5 inline-flex flex-col items-start gap-4
                      rounded-2xl border-y-4 border-r-4 border-gray-300
                      bg-gray-800 pt-4 pb-6 pl-10 shadow-lg
                      md:pt-5 md:pb-7
                      lg:pt-6 lg:pb-8
                    "
                >
                    {...sidePanelBoxes}
                </div>
            )}
        </div>
    );
}

export default CalculatorPanel;
