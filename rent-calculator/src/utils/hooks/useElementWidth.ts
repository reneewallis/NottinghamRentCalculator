import { useLayoutEffect, useState } from "react";

export function useElementWidthRem(ref?: React.RefObject<HTMLElement | null>) {
    const [widthRem, setWidthRem] = useState(0);

    useLayoutEffect(() => {
        const element = ref?.current;
        if (!element) return;

        const update = () => {
            const widthPx = element.offsetWidth;

            const rootFontSize = parseFloat(
                getComputedStyle(document.documentElement).fontSize
            );

            setWidthRem(widthPx / rootFontSize);
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(element);

        return () => observer.disconnect();
    }, [ref]);

    return widthRem;
}