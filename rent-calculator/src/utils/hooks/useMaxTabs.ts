import { useViewportWidthRem } from "./useViewportWidth";
import { getMaxTabs } from "../helperFunctions";
import { useElementWidthRem } from "./useElementWidth";

export function useMaxTabs<T extends HTMLElement>(ref?: React.RefObject<T | null>){
    const viewportWidth = useViewportWidthRem();
    const elementWidth = useElementWidthRem(ref);

    const width = ref?.current
        ? elementWidth
        : viewportWidth;

    return getMaxTabs(width);
}