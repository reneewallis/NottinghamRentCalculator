import { useCallback, useRef, useState } from "react";

export function useElementWidthRem() {
    const [widthRem, setWidthRem] = useState<number>(0);
    const disconnectRef = useRef<(() => void) | null>(null);

    const ref = useCallback((node: HTMLElement | null) => {
        if (disconnectRef.current) {
            disconnectRef.current();
            disconnectRef.current = null;
        }

        if (!node) return;

        const update = () => {
            const widthPx = node.scrollWidth;
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            setWidthRem(widthPx / rootFontSize);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);

        disconnectRef.current = () => observer.disconnect();
    }, []);

    return { ref, width: widthRem };
}
