import { useCallback, useMemo, useRef } from "react";

export type CollectionItem<T> = {
  node: HTMLElement;
  value: T;
  label: string;
  id: string;
};

export type RegisterItemFn<T> = (
  item: CollectionItem<T>,
) => () => void;

export const useCollection = <T>() => {
  const itemsRef = useRef(new Map<HTMLElement, CollectionItem<T>>());

  const registerItem = useCallback<RegisterItemFn<T>>((item) => {
    const { node } = item;

    itemsRef.current.set(node, item);

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
