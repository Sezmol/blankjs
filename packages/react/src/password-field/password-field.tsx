import { useFieldControlProps } from "@blankjs/core";
import { useState, type ComponentProps } from "react";
import type { Size } from "../types";

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="3" y1="3" x2="21" y2="21" />}
  </svg>
);

type PasswordFieldProps = Omit<ComponentProps<"input">, "size"> & {
  size?: Size;
};

export const PasswordField = ({
  className,
  disabled,
  size = "md",
  ...rest
}: PasswordFieldProps) => {
  const fieldProps = useFieldControlProps();

  const [visible, setVisible] = useState(false);

  const isDisabled = disabled || fieldProps.disabled;

  const mergedInput = ["bk-input", className].filter(Boolean).join(" ");

  return (
    <div className="bk-password" data-size={size}>
      <input
        {...rest}
        {...fieldProps}
        type={visible ? "text" : "password"}
        disabled={isDisabled}
        className={mergedInput}
      />

      <button
        className="bk-password-toggle"
        type="button"
        disabled={isDisabled}
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        onMouseDown={(e) => e.preventDefault()}
      >
        <EyeIcon off={visible} />
      </button>
    </div>
  );
};
