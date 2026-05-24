import { useEffect, useState } from "react";
import { TAB_BUTTONS_CONTAINER_WIDTH, TAB_CONTAINER_WIDTH } from "../components/Tabs/tabConsts";
import { getMaxTabs } from "./helperFunctions";

export function useViewportWidthRem(){
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            const widthPx = document.documentElement.clientWidth;

            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

            setWidth(widthPx / rootFontSize);
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(document.documentElement);

        return () => observer.disconnect();
    }, []);

    return width;
}

export function useMaxTabs(){
    const viewportWidth = useViewportWidthRem();
    return getMaxTabs(viewportWidth);
}