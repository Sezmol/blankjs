import { useCallback, useId, useMemo, useState } from "react";
import type { DialogContextValue, UseDialogRootOptions } from "./types";
import { useControllableState } from "@blankjs/core";

export const useDialogRoot = (
  options: UseDialogRootOptions = {},
): DialogContextValue => {
  const [open, setOpen] = useControllableState({
    prop: options.open,
    defaultProp: options.defaultOpen,
    onChange: options.onOpenChange,
  });

  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const titleId = useId();
  const descriptionId = useId();

  const registerTitle = useCallback(() => {
    setHasTitle(true);

    return () => setHasTitle(false);
  }, []);

  const registerDescription = useCallback(() => {
    setHasDescription(true);

    return () => setHasDescription(false);
  }, []);

  return useMemo(
    () => ({
      open: open ?? false,
      setOpen,

      titleId,
      descriptionId,

      hasTitle,
      hasDescription,

      registerTitle,
      registerDescription,
    }),
    [
      descriptionId,
      hasDescription,
      hasTitle,
      open,
      registerDescription,
      registerTitle,
      setOpen,
      titleId,
    ],
  );
};
