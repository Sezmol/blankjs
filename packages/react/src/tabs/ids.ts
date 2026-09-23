export const tabId = (baseId: string, value: string) =>
  `${baseId}-tab-${encodeURIComponent(value)}`;

export const panelId = (baseId: string, value: string) =>
  `${baseId}-panel-${encodeURIComponent(value)}`;
