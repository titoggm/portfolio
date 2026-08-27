// `bun:test` and the other Bun built-in modules only have types through @types/bun.
// Auto-inclusion of @types packages is order-dependent in the editor's TS server, so
// reference it explicitly here the way next-env.d.ts does for React.
/// <reference types="bun" />
