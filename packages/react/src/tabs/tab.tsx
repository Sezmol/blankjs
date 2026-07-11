import type { ComponentProps, MouseEvent } from "react";
import { useTabsContext } from "./context";

type TabProps = ComponentProps<"button"> & {
  value: string;
};

export const Tab = ({
  children,
  className,
  value,
  onClick,
  ...props
}: TabProps) => {
  const { value: selectedValue, setValue, baseId } = useTabsContext();

  const selected = selectedValue === value;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    setValue(value);
  };

  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      {...props}
      type="button"
      onClick={handleClick}
      className={["bk-tabs-tab", className].filter(Boolean).join(" ")}
      role="tab"
      data-value={value}
      id={tabId}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
    >
      {children}
    </button>
  );
};

Tab.displayName = "Tabs.Tab";
