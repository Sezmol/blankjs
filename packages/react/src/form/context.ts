import { createContext } from "react";

export interface FormContextType {
  errors?: Record<string, string>;
  submitting?: boolean;
  clearErrors?: (prefix: string) => void;
}

export const FormContext = createContext<FormContextType | null>(null);
