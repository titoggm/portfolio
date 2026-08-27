// jest-dom ships a `bun:test` augmentation but does not expose it through its package
// exports, so it is re-declared here from the types it does export. Without this, every
// `expect(...).toBeInTheDocument()` is a TS2339 error.
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { expect } from "bun:test";

declare module "bun:test" {
  // Declaration merging requires an interface, so the empty body is the point here.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<T = unknown>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}
}
