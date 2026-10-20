export const getGroupItems = (root: Element) =>
  Array.from(root.querySelectorAll("[data-bk-checkbox-group-item]")).filter(
    (element): element is HTMLInputElement =>
      element instanceof HTMLInputElement &&
      element.closest("[data-bk-checkbox-group]") === root,
  );
