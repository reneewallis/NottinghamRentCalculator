import { useViewportWidthRem } from "./useViewportWidth";
import { getMaxTabs } from "../helperFunctions";

export function useMaxTabs(){
    const viewportWidth = useViewportWidthRem();
    return getMaxTabs(viewportWidth);
}