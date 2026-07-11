import { useRef, type ComponentProps, type KeyboardEvent } from "react";
import { useTabsContext } from "./context";
import { useTabsIndicator } from "./use-tabs-indicator";
import { composeRefs } from "../slot";

type TabsListProps = ComponentProps<"div">;

export const TabsList = ({ children, className, ...props }: TabsListProps) => {
  const { setValue, activationMode, orientation } = useTabsContext();

  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useTabsIndicator(listRef);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(e);

    if (e.defaultPrevented) return;

    const list = listRef.current;

    if (!list) return;

    const [prevKey, nextKey] =
      orientation === "vertical"
        ? (["ArrowUp", "ArrowDown"] as const)
        : (["ArrowLeft", "ArrowRight"] as const);

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );

    const index = tabs.indexOf(e.target as HTMLButtonElement);

    if (index === -1) return;

    let next: HTMLButtonElement | undefined;

    switch (e.key) {
      case nextKey:
        next = tabs[(index + 1) % tabs.length];

        break;
      case prevKey:
        next = tabs[(index - 1 + tabs.length) % tabs.length];

        break;
      case "Home":
        next = tabs[0];

        break;
      case "End":
        next = tabs[tabs.length - 1];

        break;
      default:
        return;
    }

    if (!next) return;

    e.preventDefault();

    next.focus();

    if (activationMode === "automatic" && next.dataset.value) {
      setValue(next.dataset.value);
    }
  };

  return (
    <div
      {...props}
      ref={composeRefs(listRef, props.ref)}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={onKeyDown}
      className={["bk-tabs-list", className].filter(Boolean).join(" ")}
    >
      {children}

      <span
        ref={indicatorRef}
        className="bk-tabs-indicator"
        data-part="indicator"
        aria-hidden="true"
      />
    </div>
  );
};

TabsList.displayName = "Tabs.List";
