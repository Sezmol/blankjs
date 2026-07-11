import "@testing-library/jest-dom/vitest";

// jsdom does not implement scrollIntoView, we are jamming it so that components with auto-scroll do not crash in tests
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom does not implement ResizeObserver, used by the tabs indicator
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
