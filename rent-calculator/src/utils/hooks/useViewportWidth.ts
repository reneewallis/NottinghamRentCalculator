import { useEffect, useState } from "react";

export function useViewportWidthRem() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            const widthPx = document.documentElement.clientWidth;

            const rootFontSize = parseFloat(
                getComputedStyle(document.documentElement).fontSize,
            );

            setWidth(widthPx / rootFontSize);
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(document.documentElement);

        return () => observer.disconnect();
    }, []);

    return width;
}
