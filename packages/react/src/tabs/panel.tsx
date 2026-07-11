import { useEffect, useRef, type ComponentProps } from "react";
import { useTabsContext } from "./context";
import { composeRefs } from "../slot";

type TabsPanelProps = ComponentProps<"div"> & {
  value: string;
};

export const TabsPanel = ({
  className,
  children,
  value,
  ...props
}: TabsPanelProps) => {
  const { value: selectedValue, setValue, baseId } = useTabsContext();

  const selected = selectedValue === value;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    const onBeforeMatch = () => setValue(value);

    node.addEventListener("beforematch", onBeforeMatch);

    return () => node.removeEventListener("beforematch", onBeforeMatch);
  }, [setValue, value]);

  // React renders any truthy hidden as a bare attribute (facebook/react#24740),
  // so the "until-found" value has to be set imperatively
  useEffect(() => {
    if (!selected) ref.current?.setAttribute("hidden", "until-found");
  }, [selected]);

  return (
    <div
      {...props}
      ref={composeRefs(ref, props.ref)}
      id={`${baseId}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      hidden={!selected}
      className={["bk-tabs-panel", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};

TabsPanel.displayName = "Tabs.Panel";
