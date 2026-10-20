import { getGroupItems } from "../internal";

export const syncRequired = (root: HTMLElement, required: boolean) => {
  const items = getGroupItems(root);
  const available = items.filter((item) => !item.matches(":disabled"));
  const missing = required && !available.some((item) => item.checked);

  for (const item of items) item.required = missing && available.includes(item);

  return available[0] ?? items[0];
};
