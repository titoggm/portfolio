import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterEach, expect, mock } from "bun:test";

// Must happen before anything from @testing-library loads: its `screen` export binds
// `document.body` at module-evaluation time and permanently throws if there was no DOM
// yet. Those modules are therefore imported dynamically below, after registration.
// `disableIframePageLoading` keeps the track player's YouTube embeds from being fetched
// for real, which otherwise stalls the suite for ~45s and logs teardown races.
// `disableJavaScriptFileLoading` does the same for the YouTube IFrame Player API script
// the track player injects; tests stub `window.YT` instead of loading the real thing.
GlobalRegistrator.register({
  settings: {
    disableIframePageLoading: true,
    disableJavaScriptFileLoading: true,
  },
});

// Both blocked resources then log a NotSupportedError apiece. Filter exactly those two
// messages and let every other error through.
const consoleError = console.error;
const BLOCKED_RESOURCE_NOISE = [
  "Iframe page loading is disabled",
  "JavaScript file loading is disabled",
];
console.error = (...args: unknown[]) => {
  const [first] = args;
  const message = first instanceof Error ? first.message : String(first);
  if (BLOCKED_RESOURCE_NOISE.some((noise) => message.includes(noise))) return;
  consoleError(...args);
};

const matchers = await import("@testing-library/jest-dom/matchers");
const React = await import("react");
const { cleanup } = await import("@testing-library/react");

expect.extend(matchers as unknown as Parameters<typeof expect.extend>[0]);

// next/image relies on the Next runtime's image optimizer, which does not exist outside
// `next dev` / `next build`. Render a plain <img> carrying the props tests assert on.
mock.module("next/image", () => ({
  __esModule: true,
  // Only the props that map onto a real <img> are forwarded; Next-only ones such as
  // `priority` and `sizes` are dropped rather than leaked as invalid DOM attributes.
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    [key: string]: unknown;
  }) => React.createElement("img", { src, alt, width, height, className }),
  // The real one resolves an optimizer URL, which needs the Next runtime. The
  // preload hook only reads `src`/`srcSet`/`sizes` back off it.
  getImageProps: ({
    src,
    sizes,
  }: {
    src: string;
    sizes?: string;
    [key: string]: unknown;
  }) => ({ props: { src, srcSet: `${src} 1x`, sizes } }),
}));

afterEach(cleanup);
