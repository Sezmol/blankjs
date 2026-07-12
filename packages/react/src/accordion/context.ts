import { createContext, useContext } from "react";
import type { AccordionContextValue } from "./types";

export const AccordionContext = createContext<AccordionContextValue | null>(
  null,
);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("[blankjs] Accordion.* must be used within Accordion.Root");
  }

  return context;
};
