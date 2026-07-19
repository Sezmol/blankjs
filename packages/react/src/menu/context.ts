import type { CollectionItem, RegisterItemFn } from "@blankjs/core";
import { createContext, useContext } from "react";

export type AnchorElement = HTMLElement | null;

export type MenuItemData = CollectionItem<string>;

export interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  anchor: AnchorElement;
  setAnchor: (node: AnchorElement) => void;
  activeItem: MenuItemData | undefined;
  setActiveItem: (item: MenuItemData | undefined) => void;
  registerItem: RegisterItemFn<string>;
  getItems: () => MenuItemData[];
}

export const MenuContext = createContext<MenuContextValue | null>(null);

export const useMenuContext = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("[blankjs] Menu.* must be used within Menu.Root");
  }

  return context;
};
