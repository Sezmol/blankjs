import { createContext } from "react";

export interface FormContextType {
  errors?: Record<string, string>;
  submitting?: boolean;
  /** drops schema errors at or below a path; server errors stay, they are yours */
  clearErrors?: (prefix: string) => void;
}

export const FormContext = createContext<FormContextType | null>(null);
