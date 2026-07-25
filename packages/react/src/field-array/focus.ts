const isFocusable = (node: HTMLElement) =>
  !node.hasAttribute("disabled") && node.tabIndex >= 0;

export const isInRow = (node: Element | null, prefix: string) => {
  const name = node?.getAttribute("name");

  return name === prefix || !!name?.startsWith(`${prefix}.`);
};

const query = (root: HTMLElement, attribute: string) => [
  ...root.querySelectorAll<HTMLElement>(`[${attribute}]`),
];

export const focusFirstControl = (root: HTMLElement, prefix: string) => {
  for (const control of query(root, "name")) {
    if (!isInRow(control, prefix) || !isFocusable(control)) continue;

    control.focus();

    return true;
  }

  return false;
};

export const removeButtons = (root: HTMLElement, name: string) =>
  query(root, "data-bk-field-array-remove").filter(
    (node) => node.dataset.bkFieldArrayRemove === name && isFocusable(node),
  );

export const addButton = (root: HTMLElement, name: string) =>
  query(root, "data-bk-field-array-add").find(
    (node) => node.dataset.bkFieldArrayAdd === name && isFocusable(node),
  ) ?? null;
