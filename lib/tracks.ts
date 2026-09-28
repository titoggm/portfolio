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
    src: "https://www.youtube.com/embed/PHEbmPRBuU8?si=Lf8eVViO19JAHkVP",
    title: "Spirit Wave",
    artist: "Mall Grab",
  },
  {
    src: "https://www.youtube.com/embed/ayHf80j1qqI?si=4nRa87Zg-ODBRehP",
    title: "Dreams VIP",
    artist: "Interplanetary Criminal",
  },
  {
    src: "https://www.youtube.com/embed/c1vbu9dyE8U?si=d0C5sFIKWDOkwh5a",
    title: "Untitled 02",
    artist: "Leod",
  },
  {
    src: "https://www.youtube.com/embed/NdlNDmeqM8I?si=eJ0CX7_WCcQOd2no",
    title: "Climax (Bomba Records)",
    artist: "Smooth & Simmonds",
  },
  {
    src: "https://www.youtube.com/embed/04AZSXWSBpI?si=lVAnXjPBOw6t6ZYp",
    title: "Northern Piano (Hardcore Piano Mix)",
    artist: "Ultraworld",
  },
  {
    src: "https://www.youtube.com/embed/ZInibX0Zb6U?si=9jEiz7jmvSm74mrS",
    title: "Hold On, Hold On",
    artist: "Jak Stratford",
  },
  {
    src: "https://www.youtube.com/embed/CgtZEHbTtyI?si=ZkvqBP7MB5-QfFNf",
    title: "Towlift",
    artist: "Loidis",
  },
  {
    src: "https://www.youtube.com/embed/PJ38Sp8zhHs?si=p2AYrxW7MfGVQmMR",
    title: "Don't You Want Me Edit",
    artist: "Soul Mass Transit System",
  },
  {
    src: "https://www.youtube.com/embed/OE2DEdPs_lY?si=pQCiEa7ZA1g-TV5_",
    title: "A Song For Remy",
    artist: "Goshawk",
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
