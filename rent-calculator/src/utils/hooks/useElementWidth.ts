import { useCallback, useLayoutEffect, useState } from "react";

export function useElementWidthRem() {
    const [widthRem, setWidthRem] = useState(0);
    const [element, setElement] = useState<HTMLElement | null>(null);

    const ref = useCallback((node: HTMLElement | null) => {
        setElement(node);
    }, []);

    useLayoutEffect(() => {
        if (!element) return;

        const update = () => {
            const widthPx = element.scrollWidth;

            const rootFontSize = parseFloat(
                getComputedStyle(document.documentElement).fontSize,
            );

            setWidthRem(widthPx / rootFontSize);
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(element);

        return () => observer.disconnect();
    }, [element]);

    return { ref, width: widthRem };
}
