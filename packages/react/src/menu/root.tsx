import { useCollection, useControllableState } from "@blankjs/core";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

  const controlled = props.open !== undefined;

  const [anchor, setAnchor] = useState<AnchorElement>(null);

  const [shown, setShown] = useState(false);

  const contentRef = useRef<HTMLElement | null>(null);

  const setContent = useCallback((node: HTMLElement | null) => {
    contentRef.current = node;
  }, []);

  const show = useCallback(() => {
    const content = contentRef.current;

    if (content && !content.matches(":popover-open")) {
      content.showPopover({ source: anchor ?? undefined });
    }
  }, [anchor]);

  const { registerItem, getItems } = useCollection<string>();

  const [activeItem, setActiveItem] = useState<MenuItemData>();

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
      controlled,
      setOpen: setOpenAndReset,
      shown,
      setShown,
      show,
      setContent,

      getItems,
      registerItem,
    }),
    [
      activeItem,
      anchor,
      contentId,
      controlled,
      getItems,
      open,
      registerItem,
      setContent,
      setOpenAndReset,
      show,
      shown,
    ],
  );

  return <MenuContext value={contextValue}>{props.children}</MenuContext>;
};
