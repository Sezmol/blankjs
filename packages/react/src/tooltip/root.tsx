import { useControllableState } from "@blankjs/core";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  TooltipContext,
  type AnchorElement,
  type TooltipContextValue,
} from "./context";

const DEFAULT_OPEN_DELAY = 500;
const CLOSE_DELAY = 100;
const SKIP_DELAY_WINDOW = 300;

let lastClosedAt = 0;

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  children: ReactNode;
}

export const TooltipRoot = (props: TooltipRootProps) => {
  const [open, setOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  const contentId = useId();

  const [anchor, setAnchor] = useState<AnchorElement>(null);

  const timer = useRef<number>(0);

  const close = useCallback(() => {
    lastClosedAt = Date.now();

    setOpen(false);
  }, [setOpen]);

  const scheduleOpen = useCallback(() => {
    clearTimeout(timer.current);

    const delay =
      Date.now() - lastClosedAt < SKIP_DELAY_WINDOW
        ? 0
        : (props.delay ?? DEFAULT_OPEN_DELAY);

    timer.current = setTimeout(() => setOpen(true), delay);
  }, [props.delay, setOpen]);

  const scheduleClose = useCallback(() => {
    if (open) lastClosedAt = Date.now();

    clearTimeout(timer.current);

    timer.current = setTimeout(close, CLOSE_DELAY);
  }, [close, open]);

  const cancelClose = useCallback(() => {
    clearTimeout(timer.current);
  }, []);

  const openNow = useCallback(() => {
    setOpen(true);
    clearTimeout(timer.current);
  }, [setOpen]);

  const closeNow = useCallback(() => {
    close();
    clearTimeout(timer.current);
  }, [close]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const contextValue = useMemo<TooltipContextValue>(
    () => ({
      anchor,
      setAnchor,

      open: open ?? false,
      setOpen,

      scheduleOpen,
      scheduleClose,

      cancelClose,

      openNow,
      closeNow,

      contentId,
    }),
    [
      anchor,
      cancelClose,
      closeNow,
      contentId,
      open,
      openNow,
      scheduleClose,
      scheduleOpen,
      setOpen,
    ],
  );

  return <TooltipContext value={contextValue}>{props.children}</TooltipContext>;
};
