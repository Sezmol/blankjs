import {
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import { useDialogContext } from "./context";
import { composeRefs } from "../slot";

type DialogContentProps = ComponentProps<"dialog">;

export const DialogContent = ({
  children,
  onCancel,
  onClick,
  ref,
  className,
  ...props
}: DialogContentProps) => {
  const { open, setOpen, hasTitle, titleId, hasDescription, descriptionId } =
    useDialogContext();

  const innerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = innerRef.current;

    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();

    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    onCancel?.(e);

    if (e.defaultPrevented) return;

    e.preventDefault();

    setOpen(false);
  };

  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    if (e.target === innerRef.current) setOpen(false);
  };

  return (
    <dialog
      {...props}
      ref={composeRefs(ref, innerRef)}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      onCancel={handleCancel}
      onClick={handleClick}
      className={["bk-dialog-content", className].filter(Boolean).join(" ")}
    >
      <div className="bk-dialog-inner">{children}</div>
    </dialog>
  );
};

DialogContent.displayName = "Dialog.Content";
