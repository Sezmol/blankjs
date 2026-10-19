export const closestLayer = (element: Element | null) =>
  element?.closest<HTMLElement>("dialog, [popover]") ?? null;
