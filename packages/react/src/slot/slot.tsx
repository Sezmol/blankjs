import {
  cloneElement,
  isValidElement,
  Children,
  type ReactElement,
  type Ref,
  type HTMLAttributes,
} from "react";
import { mergeProps } from "./merge-props";
import { composeRefs } from "./compose-refs";

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactElement;
  ref?: Ref<HTMLElement>;
}

export const Slot = ({ children, ...slotProps }: SlotProps) => {
  if (!isValidElement(children)) {
    return Children.count(children) > 1 ? Children.only(null) : null;
  }

  const childProps = children.props as Record<string, unknown>;
  const childRef = (childProps as { ref?: Ref<unknown> }).ref;
  const slotRef = slotProps.ref as Ref<unknown> | undefined;

  const merged = mergeProps(slotProps, childProps);

  if (slotRef || childRef) {
    merged.ref = composeRefs(slotRef, childRef);
  }

  return cloneElement(children, merged);
};
