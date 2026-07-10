import type { CollectionItem } from "@blankjs/core";
import { useEffect, useState } from "react";

export interface UseInitialActiveItemOptions<T> {
  getItems: () => CollectionItem<T>[];
  setActiveItem: (item: CollectionItem<T> | undefined) => void;
  isSelected: (item: CollectionItem<T>) => boolean;
}

export const useInitialActiveItem = <T>({
  getItems,
  setActiveItem,
  isSelected,
}: UseInitialActiveItemOptions<T>) => {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const items = getItems();
    const selected = items.find(isSelected);

    setActiveItem(selected ?? items[0]);

    return () => setActiveItem(undefined);
    // re-runs when mounted flips true: the commit after Items registered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return mounted;
};
