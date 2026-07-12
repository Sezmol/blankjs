import type { PropsWithChildren } from "react";
import type { UseDialogRootOptions } from "./types";
import { useDialogRoot } from "./use-dialog-root";
import { DialogContext } from "./context";

type DialogRootProps = PropsWithChildren<UseDialogRootOptions>;

export const DialogRoot = ({ children, ...options }: DialogRootProps) => {
  const contextValue = useDialogRoot(options);

  return <DialogContext value={contextValue}>{children}</DialogContext>;
};

DialogRoot.displayName = "Dialog.Root";
