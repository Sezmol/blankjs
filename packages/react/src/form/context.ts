import { createContext } from "react";

export interface FormContextType {
  errors?: Record<string, string>;
  submitting?: boolean;
}

export const FormContext = createContext<FormContextType | null>(null);
