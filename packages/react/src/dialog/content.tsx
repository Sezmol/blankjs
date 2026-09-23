import {
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type PointerEvent,
  type SyntheticEvent,
} from "react";
import { useDialogContext } from "./context";
import { composeRefs } from "../slot";

type DialogContentProps = ComponentProps<"dialog">;

export const DialogContent = ({
  children,
  onCancel,
  onClose,
  onClick,
  onPointerDown,
  ref,
  className,
  ...props
}: DialogContentProps) => {
  const { open, setOpen, hasTitle, titleId, hasDescription, descriptionId } =
    useDialogContext();

  const innerRef = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);

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

  const handlePointerDown = (e: PointerEvent<HTMLDialogElement>) => {
    onPointerDown?.(e);

    pressedBackdrop.current = e.target === innerRef.current;
  };

  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    if (e.target === innerRef.current && pressedBackdrop.current) {
      setOpen(false);
    }
  };

  const handleClose = (e: SyntheticEvent<HTMLDialogElement>) => {
    if (!e.currentTarget.open) setOpen(false);
    onClose?.(e);
  };

  return (
    <dialog
      {...props}
      ref={composeRefs(ref, innerRef)}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      onCancel={handleCancel}
      onClose={handleClose}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      className={["bk-dialog-content", className].filter(Boolean).join(" ")}
    >
      <div className="bk-dialog-inner">{children}</div>
    </dialog>
  );
};

DialogContent.displayName = "Dialog.Content";
