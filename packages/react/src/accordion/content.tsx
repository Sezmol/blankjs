import type { ComponentProps } from "react";

type AccordionContentProps = ComponentProps<"div">;

export const AccordionContent = ({
  children,
  className,
  ...props
}: AccordionContentProps) => {
  return (
    <div
      {...props}
      className={["bk-accordion-content", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
};

AccordionContent.displayName = "Accordion.Content";
