import { type ComponentProps, type ToggleEvent } from "react";
import { useAccordionContext } from "./context";

type AccordionItemProps = Omit<ComponentProps<"details">, "name"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const AccordionItem = ({
  open,
  defaultOpen,
  onOpenChange,
  onToggle,
  children,
  className,
  ...props
}: AccordionItemProps) => {
  const { name } = useAccordionContext();

  const handleToggle = (e: ToggleEvent<HTMLDetailsElement>) => {
    onToggle?.(e);

    if (e.defaultPrevented) return;

    const next = e.newState === "open";

    onOpenChange?.(next);

    // controlled: the prop is the boss - if the consumer ignored the change, revert the DOM
    if (open !== undefined && next !== open) e.currentTarget.open = open;
  };

  return (
    <details
      {...props}
      open={open ?? (defaultOpen || undefined)}
      name={name}
      onToggle={handleToggle}
      className={["bk-accordion-item", className].filter(Boolean).join(" ")}
    >
      {children}
    </details>
  );
};

AccordionItem.displayName = "Accordion.Item";
