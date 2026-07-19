import { useControllableState } from "@blankjs/core";
import { useId, useMemo, useState, type ReactNode } from "react";
import {
  PopoverContext,
  type AnchorElement,
  type PopoverContextValue,
} from "./context";

export interface PopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const PopoverRoot = (props: PopoverRootProps) => {
  const [open, setOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  const contentId = useId();

  const [anchor, setAnchor] = useState<AnchorElement>(null);

  const contextValue = useMemo<PopoverContextValue>(
    () => ({
      anchor,
      setAnchor,

      open: open ?? false,
      setOpen,

      contentId,
    }),
    [anchor, contentId, open, setOpen],
  );

  return <PopoverContext value={contextValue}>{props.children}</PopoverContext>;
};
