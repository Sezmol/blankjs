import { useCallback, useMemo, useRef } from "react";

type CollectionItem<T> = { node: HTMLElement; value: T };

export const useCollection = <T>() => {
  const itemsRef = useRef(new Map<HTMLElement, CollectionItem<T>>());

  const registerItem = useCallback((node: HTMLElement, value: T) => {
    itemsRef.current.set(node, { node, value });

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
