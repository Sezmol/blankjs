import type { Ref } from "react";

const setRef = <T>(ref: Ref<T> | undefined, node: T | null) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
};

export const composeRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  return (node: T | null) => {
    refs.forEach((ref) => setRef(ref, node));
  };
};
