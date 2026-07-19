import { useCollection, useControllableState } from "@blankjs/core";
import { useCallback, useId, useMemo, useState, type ReactNode } from "react";
import {
  MenuContext,
  type AnchorElement,
  type MenuContextValue,
  type MenuItemData,
} from "./context";

export interface MenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const MenuRoot = (props: MenuRootProps) => {
  const [open, setOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  const contentId = useId();

  const [anchor, setAnchor] = useState<AnchorElement>(null);

  const { registerItem, getItems } = useCollection<string>();

  const [activeItem, setActiveItem] = useState<MenuItemData>();

  // closing resets the highlight so a reopened menu starts clean
  const setOpenAndReset = useCallback(
    (next: boolean) => {
      if (!next) setActiveItem(undefined);

      setOpen(next);
    },
    [setOpen],
  );

  const contextValue = useMemo<MenuContextValue>(
    () => ({
      activeItem,
      setActiveItem,

      anchor,
      setAnchor,

      contentId,

      open: open ?? false,
      setOpen: setOpenAndReset,

      getItems,
      registerItem,
    }),
    [
      activeItem,
      anchor,
      contentId,
      getItems,
      open,
      registerItem,
      setOpenAndReset,
    ],
  );

  return <MenuContext value={contextValue}>{props.children}</MenuContext>;
};
