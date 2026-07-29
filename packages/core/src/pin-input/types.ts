import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
} from "react";

export type PinInputType = "numeric" | "alphanumeric";

export interface UsePinInputOptions {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: PinInputType;
  disabled?: boolean;
}

export interface PinInputCellProps {
  ref: (node: HTMLInputElement | null) => void | (() => void);
  value: string;
  maxLength: number;
  inputMode: "numeric" | "text";
  autoComplete: string;
  disabled: boolean | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;
}

export interface UsePinInputResult {
  value: string;
  chars: string[];
  length: number;
  complete: boolean;
  pattern: string;
  getCellProps: (index: number) => PinInputCellProps;
  setValue: (value: string) => void;
  clear: () => void;
  focus: (index?: number) => void;
}
