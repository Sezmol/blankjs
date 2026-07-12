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

// jsdom does not implement the dialog methods
if (
  typeof HTMLDialogElement !== "undefined" &&
  !HTMLDialogElement.prototype.showModal
) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.show = function (this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}
