import { useId, type ComponentProps } from "react";
import { AccordionContext } from "./context";

type AccordionRootProps = ComponentProps<"div"> & { exclusive?: boolean };

export const AccordionRoot = ({
  exclusive,
  className,
  children,
  ...props
}: AccordionRootProps) => {
  const name = useId();

  return (
    <AccordionContext value={{ name: exclusive ? name : undefined }}>
      <div
        {...props}
        className={["bk-accordion", className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </AccordionContext>
  );
};

AccordionRoot.displayName = "Accordion.Root";
