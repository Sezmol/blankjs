import "vitest/browser";

declare module "vitest/browser" {
  interface CDPSession {
    send(method: string, params?: Record<string, unknown>): Promise<unknown>;
  }
}
