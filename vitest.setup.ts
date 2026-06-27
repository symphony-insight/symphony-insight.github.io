import "@testing-library/jest-dom/vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

Element.prototype.getBoundingClientRect = function () {
  return {
    width: 1024,
    height: 320,
    top: 0,
    left: 0,
    right: 1024,
    bottom: 320,
    x: 0,
    y: 0,
    toJSON: () => {}
  };
};
