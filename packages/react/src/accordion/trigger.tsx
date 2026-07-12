import type { ComponentProps } from "react";

type AccordionTriggerProps = ComponentProps<"summary">;

const AccordionArrow = () => (
  <svg
    className="bk-accordion-arrow"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const AccordionTrigger = ({
  children,
  className,
  ...props
}: AccordionTriggerProps) => {
  return (
    <summary
      {...props}
      className={["bk-accordion-trigger", className].filter(Boolean).join(" ")}
    >
      {children}
      <AccordionArrow />
    </summary>
  );
};

AccordionTrigger.displayName = "Accordion.Trigger";
