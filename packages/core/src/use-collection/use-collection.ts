import { useCallback, useMemo, useRef } from "react";

export type CollectionItem<T> = { node: HTMLElement; value: T; label: string };

export type RegisterItemFn<T> = (
  node: HTMLElement,
  value: T,
  label: string,
) => () => void;

export const useCollection = <T>() => {
  const itemsRef = useRef(new Map<HTMLElement, CollectionItem<T>>());

  const registerItem = useCallback<RegisterItemFn<T>>((node, value, label) => {
    itemsRef.current.set(node, { node, value, label });

    return () => {
      itemsRef.current.delete(node);
    };
  }, []);

  const getItems = useCallback(
    () =>
      [...itemsRef.current.values()].sort((a, b) =>
        a.node.compareDocumentPosition(b.node) &
        Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1,
      ),
    [],
  );

  return useMemo(() => ({ registerItem, getItems }), [registerItem, getItems]);
};
