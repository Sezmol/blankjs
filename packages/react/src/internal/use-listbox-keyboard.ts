import type { CollectionItem, SetStateFn } from "@blankjs/core";
import { useRef, type KeyboardEvent } from "react";

export interface UseListboxKeyboardOptions {
  open: boolean;
  setOpen: SetStateFn<boolean>;
  getItems: () => CollectionItem<string>[];
  activeItem: CollectionItem<string> | undefined;
  setActiveItem: (item: CollectionItem<string> | undefined) => void;
  onCommit: (item: CollectionItem<string>) => void;
}

export const useListboxKeyboard = ({
  open,
  setOpen,
  getItems,
  activeItem,
  setActiveItem,
  onCommit,
}: UseListboxKeyboardOptions) => {
  const searchRef = useRef("");
  const timerRef = useRef<number | null>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;

    if (!open) {
      switch (key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Enter":
        case " ": {
          e.preventDefault();
          setOpen(true);

          break;
        }

        default:
          break;
      }

      return;
    }

    const items = getItems();
    const index = items.findIndex((item) => item.value === activeItem?.value);

    const isPrintable =
      key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    const isSpaceSelect = key === " " && searchRef.current === "";

    if (isPrintable && !isSpaceSelect) {
      e.preventDefault();

      searchRef.current += key;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        searchRef.current = "";
      }, 500);

      const query = searchRef.current.toLowerCase();

      for (let offset = 1; offset <= items.length; offset++) {
        const i = (index + offset) % items.length;
        const item = items[i];

        if (item && item.label.toLowerCase().startsWith(query)) {
          setActiveItem(item);

          break;
        }
      }

      return;
    }

    switch (key) {
      case "ArrowDown": {
        e.preventDefault();

        const next = items[Math.min(index + 1, items.length - 1)];

        if (next) {
          setActiveItem(next);
        }

        break;
      }

      case "ArrowUp": {
        e.preventDefault();

        const prev = items[Math.max(index - 1, 0)];

        if (prev) {
          setActiveItem(prev);
        }

        break;
      }

      case "Enter":
      case " ": {
        e.preventDefault();

        if (activeItem && searchRef.current === "") {
          onCommit(activeItem);
        }

        break;
      }

      case "Tab":
        setOpen(false);
        break;

      case "Home":
        e.preventDefault();

        setActiveItem(items[0]);

        break;

      case "End":
        e.preventDefault();

        setActiveItem(items[items.length - 1]);

        break;

      default:
        break;
    }
  };

  return onKeyDown;
};
