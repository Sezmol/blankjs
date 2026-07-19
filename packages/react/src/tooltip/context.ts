import { createContext, useContext } from "react";

export type AnchorElement = HTMLElement | null;

export interface TooltipContextValue {
  open: boolean;
  contentId: string;
  anchor: AnchorElement;
  openNow: () => void;
  closeNow: () => void;
  setAnchor: (node: AnchorElement) => void;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  cancelClose: () => void;
}

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error("[blankjs] Tooltip.* must be used within Tooltip.Root");
  }

  return context;
};
