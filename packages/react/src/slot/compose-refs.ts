import type { Ref } from "react";

const setRef = <T>(ref: Ref<T> | undefined, node: T) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
};

export const composeRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  return (node: T) => {
    refs.forEach((ref) => setRef(ref, node));
  };
};
