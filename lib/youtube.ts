/**
 * Minimal typing of, and lazy loader for, the YouTube IFrame Player API.
 *
 * A plain `<iframe>` embed cannot be played, paused, or polled for its position
 * from the page, so anything more than "here is a video" has to go through this
 * API. Only the members the track player actually calls are typed, and the
 * script is only fetched once someone runs /prime-track-ids.
 */

export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  loadVideoById(options: { videoId: string; startSeconds?: number }): void;
  cueVideoById(options: { videoId: string; startSeconds?: number }): void;
  destroy(): void;
}

export interface YouTubePlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: () => void;
    onStateChange?: (event: { data: number }) => void;
  };
}

export interface YouTubeApi {
  Player: new (
    host: HTMLElement,
    options: YouTubePlayerOptions
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** `YT.PlayerState`, inlined so comparisons don't have to wait on the script. */
export const PLAYER_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

const API_SRC = "https://www.youtube.com/iframe_api";

let pending: Promise<YouTubeApi> | null = null;

export function loadYouTubeApi(): Promise<YouTubeApi> {
  // Checked ahead of the cached promise on purpose: the script installs itself
  // on `window`, which is the newer source of truth if it is already there.
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;

  pending = new Promise<YouTubeApi>((resolve, reject) => {
    // The API calls exactly one global hook when it finishes booting, so chain
    // rather than clobber whatever else on the page may have claimed it.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube IFrame API loaded without a Player"));
    };

    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => {
      pending = null; // let a later attempt retry instead of a dead promise
      reject(new Error("YouTube IFrame API failed to load"));
    };
    document.head.appendChild(script);
  });

  return pending;
}