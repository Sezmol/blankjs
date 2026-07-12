import { useEffect, type ComponentProps } from "react";
import { useDialogContext } from "./context";

type DialogDescriptionProps = ComponentProps<"div">;

export const DialogDescription = ({
  children,
  className,
  ...props
}: DialogDescriptionProps) => {
  const { registerDescription, descriptionId } = useDialogContext();

  useEffect(() => registerDescription(), [registerDescription]);

  return (
    <div
      {...props}
      id={descriptionId}
      className={["bk-dialog-description", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};

DialogDescription.displayName = "Dialog.Description";
