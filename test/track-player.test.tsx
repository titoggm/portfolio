import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TrackPlayer } from "@/components/track-player";
import { TRACKS, youtubeId } from "@/lib/tracks";
import { trackCounter } from "./track-counter";
import { PLAYER_STATE } from "@/lib/youtube";
import {
  installFakeYouTube,
  players,
  uninstallFakeYouTube,
  type FakeYouTubePlayer,
} from "./fake-youtube";

beforeEach(installFakeYouTube);
afterEach(uninstallFakeYouTube);

/** Render, then wait for the (async) player construction and its ready event. */
async function setup() {
  const view = render(<TrackPlayer tracks={TRACKS} />);
  await waitFor(() => expect(players).toHaveLength(1));
  const player = players[0];
  await act(async () => player.emitReady());
  return { ...view, player };
}

async function play(player: FakeYouTubePlayer, duration: number) {
  player.videoDuration = duration;
  await act(async () => player.emitState(PLAYER_STATE.PLAYING));
}

describe("TrackPlayer", () => {
  test("renders the first track and the position counter", async () => {
    await setup();
    expect(screen.getByText(TRACKS[0].title)).toBeInTheDocument();
    expect(screen.getByText(TRACKS[0].artist)).toBeInTheDocument();
    expect(screen.getByText(trackCounter(1))).toBeInTheDocument();
  });

  test("hides YouTube's own chrome and starts at the track's offset", async () => {
    const { player } = await setup();
    expect(player.options.videoId).toBe(youtubeId(TRACKS[0].src));
    expect(player.options.playerVars?.controls).toBe(0);
  });

  test("play/pause is inert until the API reports ready", async () => {
    render(<TrackPlayer tracks={TRACKS} />);
    expect(screen.getByLabelText("Play")).toBeDisabled();
    await waitFor(() => expect(players).toHaveLength(1));
    await act(async () => players[0].emitReady());
    expect(screen.getByLabelText("Play")).toBeEnabled();
  });

  test("the play button drives the player and follows its reported state", async () => {
    const { player } = await setup();

    fireEvent.click(screen.getByLabelText("Play"));
    expect(player.playVideo).toHaveBeenCalled();
    // The button only flips once the player says it is playing, not on click.
    expect(screen.getByLabelText("Play")).toBeInTheDocument();

    await play(player, 180);
    fireEvent.click(screen.getByLabelText("Pause"));
    expect(player.pauseVideo).toHaveBeenCalled();

    await act(async () => player.emitState(PLAYER_STATE.PAUSED));
    expect(screen.getByLabelText("Play")).toBeInTheDocument();
  });

  test("clicking the video toggles playback instead of losing focus to the iframe", async () => {
    const { player } = await setup();
    fireEvent.click(screen.getByLabelText("Play/pause video"));
    expect(player.playVideo).toHaveBeenCalled();
  });

  test("skipping while paused cues the next track without starting it", async () => {
    const { player } = await setup();

    fireEvent.click(screen.getByLabelText("Next track"));
    expect(screen.getByText(trackCounter(2))).toBeInTheDocument();
    expect(player.cueVideoById).toHaveBeenCalledWith({
      videoId: youtubeId(TRACKS[1].src),
      startSeconds: TRACKS[1].start ?? 0,
    });
    expect(player.loadVideoById).not.toHaveBeenCalled();
  });

  test("skipping mid-playback carries the playing state into the next track", async () => {
    const { player } = await setup();
    await play(player, 180);

    fireEvent.click(screen.getByLabelText("Next track"));
    expect(player.loadVideoById).toHaveBeenCalledWith({
      videoId: youtubeId(TRACKS[1].src),
      startSeconds: TRACKS[1].start ?? 0,
    });
  });

  test("previous is disabled on the first track", async () => {
    const { player } = await setup();
    expect(screen.getByLabelText("Previous track")).toBeDisabled();

    fireEvent.click(screen.getByLabelText("Next track"));
    expect(screen.getByLabelText("Previous track")).toBeEnabled();

    fireEvent.click(screen.getByLabelText("Previous track"));
    expect(screen.getByText(trackCounter(1))).toBeInTheDocument();
    expect(player.cueVideoById).toHaveBeenLastCalledWith({
      videoId: youtubeId(TRACKS[0].src),
      startSeconds: TRACKS[0].start ?? 0,
    });
  });

  test("a finished track rolls into the next one", async () => {
    const { player } = await setup();
    await play(player, 180);
    await act(async () => player.emitState(PLAYER_STATE.ENDED));

    expect(screen.getByText(trackCounter(2))).toBeInTheDocument();
    expect(player.loadVideoById).toHaveBeenCalled();
  });

  test("the elapsed time follows the player while it plays", async () => {
    const { player } = await setup();
    player.currentTime = 30;
    await play(player, 198);

    // Duration is known as soon as playback starts; position is polled.
    await waitFor(() =>
      expect(screen.getByText("00:30 / 03:18")).toBeInTheDocument()
    );
  });

  test("the progress bar reports and accepts a position", async () => {
    const { player, container } = await setup();
    await play(player, 200);

    const bar = screen.getByRole("slider");
    // happy-dom has no layout, so the geometry click-to-seek maps against has
    // to be supplied by hand.
    bar.getBoundingClientRect = () =>
      ({ left: 0, width: 200 }) as DOMRect;

    fireEvent.click(bar, { clientX: 50 });
    expect(player.seekTo).toHaveBeenCalledWith(50, true);

    await waitFor(() => {
      expect(bar).toHaveAttribute("aria-valuenow", "50");
      expect(bar).toHaveAttribute("aria-valuemax", "200");
    });
    const fill = container.querySelector<HTMLElement>("[style*='width']");
    expect(fill?.style.width).toBe("25%");
  });

  test("tears the player down when the terminal clears it away", async () => {
    const { player, unmount } = await setup();
    unmount();
    expect(player.destroy).toHaveBeenCalled();
  });
});

describe("TrackPlayer without the IFrame API", () => {
  // The API script cannot load in this environment, which is exactly the
  // degraded case: fall back to a plain embed that keeps YouTube's own controls.
  beforeEach(uninstallFakeYouTube);

  test("falls back to an embed carrying YouTube's controls", async () => {
    const { container } = render(<TrackPlayer tracks={TRACKS} />);

    await waitFor(() => {
      expect(
        container.querySelector(`iframe[title="Track player for ${TRACKS[0].title}"]`)
      ).toBeInTheDocument();
    });
    expect(screen.queryByLabelText("Play/pause video")).toBeNull();
    // Skipping tracks still works; only the transport is gone.
    expect(screen.getByLabelText("Next track")).toBeEnabled();
    expect(screen.getByLabelText("Play")).toBeDisabled();
  });
});
