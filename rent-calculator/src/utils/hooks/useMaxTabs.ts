import { getMaxTabs } from "../helperFunctions";
import { useElementWidthRem } from "./useElementWidth";
import { useViewportWidthRem } from "./useViewportWidth";

export function useMaxTabs(container: "viewport" | "element" = "viewport") {
    const viewportWidth = useViewportWidthRem();
    const { ref, width: elementWidth } = useElementWidthRem();

    const width = container === "viewport" ? viewportWidth : elementWidth;

    return { maxTabs: getMaxTabs(width), ref };
}
