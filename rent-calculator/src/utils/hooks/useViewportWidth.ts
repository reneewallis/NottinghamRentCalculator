import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
    const observer = new ResizeObserver(callback);
    observer.observe(document.documentElement);

    return () => observer.disconnect();
};

const getSnapshot = () => {
    const widthPx = document.documentElement.clientWidth;
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return widthPx / rootFontSize;
};

export function useViewportWidthRem() {
    return useSyncExternalStore(subscribe, getSnapshot);
}
