import { createContext } from "react";

export interface FormContextType {
  errors?: Record<string, string>;
}

export const FormContext = createContext<FormContextType | null>(null);
