import { createContext, useContext } from "react";

export type AnchorElement = HTMLElement | null;

export interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  anchor: AnchorElement;
  setAnchor: (node: AnchorElement) => void;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error("[blankjs] Popover.* must be used within Popover.Root");
  }

  return context;
};
