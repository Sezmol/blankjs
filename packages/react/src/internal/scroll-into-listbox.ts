export const scrollIntoListbox = (item: HTMLElement) => {
  const listbox = item.closest<HTMLElement>('[role="listbox"]');

  if (!listbox) return;

  const box = item.getBoundingClientRect();
  const top = listbox.getBoundingClientRect().top + listbox.clientTop;
  const bottom = top + listbox.clientHeight;

  if (box.top < top) listbox.scrollTop += box.top - top;
  else if (box.bottom > bottom) listbox.scrollTop += box.bottom - bottom;
};
