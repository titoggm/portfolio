import { TRACKS } from "@/lib/tracks";

/**
 * The counter the player renders, with both halves zero-padded to two digits.
 *
 * Derived from TRACKS rather than written out, so adding or swapping a track
 * doesn't turn the suite red — the padding is spelled out here rather than
 * borrowed from the component, so these stay a real check on the format.
 */
export function trackCounter(position: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(position)} / ${pad(TRACKS.length)}`;
}
