import { useLayoutEffect, useRef, type RefObject } from "react";
import { useTabsContext } from "./context";

export const useTabsIndicator = (
  listRef: RefObject<HTMLDivElement | null>,
) => {
  const { value, orientation } = useTabsContext();

  const indicatorRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;

    if (!list || !indicator) return;

    const position = () => {
      const active = list.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]',
      );

      if (!active) {
        indicator.style.opacity = "0";

        return;
      }

      indicator.style.opacity = "1";

      if (orientation === "vertical") {
        indicator.style.top = `${active.offsetTop}px`;
        indicator.style.height = `${active.offsetHeight}px`;
        indicator.style.left = "";
        indicator.style.width = "";
      } else {
        indicator.style.left = `${active.offsetLeft}px`;
        indicator.style.width = `${active.offsetWidth}px`;
        indicator.style.top = "";
        indicator.style.height = "";
      }

      // the first measurement must land without a transition, otherwise the
      // indicator slides in from 0 on mount
      if (!animatedRef.current) {
        animatedRef.current = true;

        requestAnimationFrame(() =>
          indicator.setAttribute("data-animated", ""),
        );
      }
    };

    position();

    const observer = new ResizeObserver(position);

    observer.observe(list);

    for (const tab of list.querySelectorAll('[role="tab"]')) {
      observer.observe(tab);
    }

    return () => observer.disconnect();
  }, [listRef, value, orientation]);

  return indicatorRef;
};
