export interface Track {
  /** YouTube embed URL — the video id is parsed back out of it by `youtubeId`. */
  src: string;
  title: string;
  artist: string;
  /** Offset in seconds to start at, for tracks buried inside a longer upload. */
  start?: number;
}

export const TRACKS: Track[] = [
  {
    src: "https://www.youtube.com/embed/ZInibX0Zb6U?si=9jEiz7jmvSm74mrS",
    title: "Hold On, Hold On",
    artist: "Jak Stratford",
  },
  {
    src: "https://www.youtube.com/embed/ayHf80j1qqI?si=4nRa87Zg-ODBRehP",
    title: "Dreams VIP",
    artist: "Interplanetary Criminal",
  },
  {
    src: "https://www.youtube.com/embed/PHEbmPRBuU8?si=Lf8eVViO19JAHkVP",
    title: "Spirit Wave",
    artist: "Mall Grab",
  },
  {
    src: "https://www.youtube.com/embed/j6Sj09QAm3Q?si=3aYR4gz5pxiShcAY",
    title: "Bang Bang Debbie",
    artist: "Dem 2",
  },
  {
    src: "https://www.youtube.com/embed/RnMS-AjzhN0?si=hQEG4Yhw1Jov3GFa",
    title: "As If",
    artist: "Bass Collective",
  },
  {
    src: "https://www.youtube.com/embed/wlHy9pCFJY4?si=JLP1hTZxok0SgFO1",
    title: "Undercurrent",
    artist: "Will Daley, ARJ (IR)",
  },
  {
    src: "https://www.youtube.com/embed/haf5VJQFTjo?si=wsPR_dBmBPEli2Yw",
    title: "Burning Up",
    artist: "DJ Pooch",
  },
  {
    src: "https://www.youtube.com/embed/yWJp2x27Nkc?si=B7Ilb3v6hGnpzSsw",
    title: "Vine A Traer Te' Arte' (1994)",
    artist: "Pizarro",
  },
  {
    src: "https://www.youtube.com/embed/tsAzsP9V7HI?si=LFiRNJGL9m_PJKaD",
    title: "Win My Heart (Manuel Regnet Remix)",
    artist: "Nick Beringer",
  },
  {
    src: "https://www.youtube.com/embed/7t-KSEBsPP0?si=UPXio8L_uyeG9Ust",
    title: "The Naked Now",
    artist: "Panthera Krause",
  },
];

const EMBED_URL = /\/embed\/([\w-]{11})/;

/**
 * The IFrame Player API is driven by bare video ids, not embed URLs. Throwing
 * rather than degrading keeps a malformed entry in TRACKS loud in dev and tests.
 */
export function youtubeId(src: string): string {
  const match = EMBED_URL.exec(src);
  if (!match) throw new Error(`Not a YouTube embed URL: ${src}`);
  return match[1];
}

/**
 * `mm:ss` (or `h:mm:ss` past the hour). Minutes are padded and an unknown
 * duration reads `00:00` rather than a placeholder, so the readout keeps one
 * width from the moment it mounts and never jumps as a track loads.
 */
export function formatTime(seconds: number | null): string {
  const safe =
    seconds === null || !Number.isFinite(seconds) || seconds < 0 ? 0 : seconds;

  const total = Math.floor(safe);
  const secs = String(total % 60).padStart(2, "0");
  const mins = String(Math.floor(total / 60) % 60).padStart(2, "0");
  const hours = Math.floor(total / 3600);

  if (!hours) return `${mins}:${secs}`;
  return `${hours}:${mins}:${secs}`;
}
