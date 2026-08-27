import { mock } from "bun:test";
import type {
  YouTubeApi,
  YouTubePlayer,
  YouTubePlayerOptions,
} from "@/lib/youtube";

/**
 * Stand-in for the YouTube IFrame Player API. `loadYouTubeApi` resolves straight
 * from `window.YT` when it is already there, so installing this before render is
 * enough to exercise every path that depends on a live player — without ever
 * reaching the network, and with the player's callbacks driven by hand.
 */
export class FakeYouTubePlayer implements YouTubePlayer {
  currentTime = 0;
  videoDuration = 0;

  readonly playVideo = mock(() => {});
  readonly pauseVideo = mock(() => {});
  readonly loadVideoById = mock((options: { videoId: string }) => options);
  readonly cueVideoById = mock((options: { videoId: string }) => options);
  readonly destroy = mock(() => {});
  readonly seekTo = mock((seconds: number) => {
    this.currentTime = seconds;
  });

  constructor(
    readonly host: HTMLElement,
    readonly options: YouTubePlayerOptions
  ) {
    players.push(this);
  }

  getCurrentTime = () => this.currentTime;
  getDuration = () => this.videoDuration;

  /** Fire the API's ready callback, as the real script does once booted. */
  emitReady() {
    this.options.events?.onReady?.();
  }

  /** Fire an `YT.PlayerState` transition. */
  emitState(state: number) {
    this.options.events?.onStateChange?.({ data: state });
  }
}

export const players: FakeYouTubePlayer[] = [];

export function installFakeYouTube() {
  players.length = 0;
  window.YT = {
    Player: FakeYouTubePlayer as unknown as YouTubeApi["Player"],
  };
}

export function uninstallFakeYouTube() {
  players.length = 0;
  delete window.YT;
}
