import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { TitoOS } from "@/components/tito-os";
import { PROJECTS } from "@/lib/projects";
import { PLAYER_STATE } from "@/lib/youtube";
import { trackCounter } from "./track-counter";
import {
  installFakeYouTube,
  players,
  uninstallFakeYouTube,
} from "./fake-youtube";

function setup() {
  const view = render(<TitoOS />);
  const input = view.container.querySelector("input");
  if (!input) throw new Error("TitoOS input not found");
  return { ...view, input };
}

function runCommand(input: HTMLInputElement, name: string) {
  fireEvent.change(input, { target: { value: `/${name}` } });
  fireEvent.keyDown(input, { key: "Enter" });
}

describe("TitoOS", () => {
  beforeEach(installFakeYouTube);
  afterEach(uninstallFakeYouTube);

  test("shows the banner on first render", () => {
    setup();
    expect(screen.getByText(/TG9 v1\.1\.192/)).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to my personal portfolio/)
    ).toBeInTheDocument();
  });

  test("puts the caret after the leading / so it can be deleted", () => {
    const { input } = setup();
    expect(input.value).toBe("/");
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
  });

  test("typing / lists the available commands", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "/" } });
    for (const name of [
      "prime-about",
      "prime-track-ids",
      "prime-projects",
      "prime-linkedin",
      "prime-email",
      "clear",
    ]) {
      expect(screen.getAllByText(`/${name}`).length).toBeGreaterThan(0);
    }
  });

  test("/prime-projects renders a project card in the output", () => {
    const { input } = setup();
    runCommand(input, "prime-projects");
    expect(screen.getByText(PROJECTS[0].title)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: new RegExp(PROJECTS[0].title, "i") })
    ).toBeInTheDocument();
  });

  test("/prime-projects no longer renders the old overlay chrome", () => {
    const { input } = setup();
    runCommand(input, "prime-projects");
    expect(screen.queryByText(/esc to close/i)).toBeNull();
    expect(screen.queryByLabelText("Close projects")).toBeNull();
    expect(screen.queryByLabelText("Next project")).toBeNull();
  });

  test("/prime-projects signs off with the more-coming note", () => {
    const { input } = setup();
    runCommand(input, "prime-projects");
    expect(
      screen.getByText(/adding more of my projects soon/i)
    ).toBeInTheDocument();
  });

  test("/prime-about still prints the bio", async () => {
    const { input } = setup();
    runCommand(input, "prime-about");
    await waitFor(() => {
      expect(
        screen.getByText(/AI-Native Product Designer/)
      ).toBeInTheDocument();
    });
  });

  test("/clear resets the output back to the banner", () => {
    const { input, container } = setup();
    runCommand(input, "prime-projects");
    expect(screen.getByText(PROJECTS[0].title)).toBeInTheDocument();
    runCommand(input, "clear");
    expect(screen.queryByText(PROJECTS[0].title)).toBeNull();
    expect(container.textContent).toContain("TG9 v1.1.192");
  });

  test("arrow keys still drive the track player", () => {
    const { input, container } = setup();
    runCommand(input, "prime-track-ids");
    expect(container.textContent).toContain(trackCounter(1));
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(container.textContent).toContain(trackCounter(2));
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(container.textContent).toContain(trackCounter(1));
  });
});

describe("TitoOS transport keys", () => {
  beforeEach(installFakeYouTube);
  afterEach(uninstallFakeYouTube);

  /** Start the player and wait for the fake API to hand back a ready player. */
  async function setupPlayer() {
    const harness = setup();
    runCommand(harness.input, "prime-track-ids");
    await waitFor(() => expect(players).toHaveLength(1));
    const player = players[0];
    await act(async () => player.emitReady());
    return { ...harness, player };
  }

  test("space toggles playback on an empty command line", async () => {
    const { input, player } = await setupPlayer();

    fireEvent.keyDown(input, { key: " " });
    expect(player.playVideo).toHaveBeenCalled();

    await act(async () => player.emitState(PLAYER_STATE.PLAYING));
    fireEvent.keyDown(input, { key: " " });
    expect(player.pauseVideo).toHaveBeenCalled();
  });

  test("space stays a plain character while a command is being typed", async () => {
    const { input, player } = await setupPlayer();
    // Becoming ready auto-plays, so the baseline here is one call, not none:
    // what's under test is that the space key adds no further one.
    player.playVideo.mockClear();
    fireEvent.change(input, { target: { value: "/prime" } });

    fireEvent.keyDown(input, { key: " " });
    expect(player.playVideo).not.toHaveBeenCalled();
  });

  test("left and right seek by ten seconds", async () => {
    const { input, player } = await setupPlayer();
    player.videoDuration = 200;
    await act(async () => player.emitState(PLAYER_STATE.PLAYING));
    player.currentTime = 40;

    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect(player.seekTo).toHaveBeenLastCalledWith(50, true);

    fireEvent.keyDown(input, { key: "ArrowLeft" });
    expect(player.seekTo).toHaveBeenLastCalledWith(40, true);
  });
});
