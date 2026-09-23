export const scrollIntoListbox = (item: HTMLElement) => {
  const listbox = item.closest<HTMLElement>('[role="listbox"]');

  if (!listbox?.offsetHeight) return;

  const view = listbox.getBoundingClientRect();
  const scale = view.height / listbox.offsetHeight;
  const box = item.getBoundingClientRect();
  const above = (box.top - view.top) / scale - listbox.clientTop;
  const below = (box.bottom - view.top) / scale - listbox.clientTop - listbox.clientHeight;

  if (above < 0) listbox.scrollTop += above;
  else if (below > 0) listbox.scrollTop += Math.min(below, above);
};
