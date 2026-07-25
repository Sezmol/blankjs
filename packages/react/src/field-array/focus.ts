const isFocusable = (node: HTMLElement) =>
  !node.hasAttribute("disabled") && node.tabIndex >= 0;

/** `users[0]` also owns `users[0].email` and `users[0].phones[1]` */
export const isInRow = (node: Element | null, prefix: string) => {
  const name = node?.getAttribute("name");

  return name === prefix || !!name?.startsWith(`${prefix}.`);
};

// attributes are matched by reading them, not by building a selector out of
// them: the array name comes from the consumer, and a quote in it would turn
// a selector string into a DOMException
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

// scoped by array name so a nested array's buttons are not picked up.
// disabled ones are dropped: at minItems every remove button is disabled and
// focusing one is a silent no-op that drops focus to the body
export const removeButtons = (root: HTMLElement, name: string) =>
  query(root, "data-bk-field-array-remove").filter(
    (node) => node.dataset.bkFieldArrayRemove === name && isFocusable(node),
  );

export const addButton = (root: HTMLElement, name: string) =>
  query(root, "data-bk-field-array-add").find(
    (node) => node.dataset.bkFieldArrayAdd === name && isFocusable(node),
  ) ?? null;
