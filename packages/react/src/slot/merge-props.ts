type Props = Record<string, unknown>;

type Fn = (...args: unknown[]) => void;

export const mergeProps = (slotProps: Props, childProps: Props): Props => {
  const merged: Props = { ...slotProps, ...childProps };

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (childValue === undefined) {
      merged[key] = slotValue;
      continue;
    }

    const isHandler = /^on[A-Z]/.test(key);

    if (isHandler) {
      const bothFns =
        typeof slotValue === "function" && typeof childValue === "function";

      if (bothFns) {
        merged[key] = (...args: unknown[]) => {
          (childValue as Fn)(...args);
          (slotValue as Fn)(...args);
        };
      }
    } else if (key === "className") {
      merged[key] = [slotValue, childValue].filter(Boolean).join(" ");
    } else if (key === "style") {
      merged[key] = {
        ...(slotValue as Record<string, unknown>),
        ...(childValue as Record<string, unknown>),
      };
    }
  }

  return merged;
};
