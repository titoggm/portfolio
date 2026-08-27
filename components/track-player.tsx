"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { formatTime, youtubeId, type Track } from "@/lib/tracks";
import {
  loadYouTubeApi,
  PLAYER_STATE,
  type YouTubePlayer,
} from "@/lib/youtube";

/** Seconds jumped by the ← → keys routed in from the command line. */
export const SEEK_STEP = 10;

export interface TrackPlayerHandle {
  next: () => void;
  prev: () => void;
  toggle: () => void;
  seekBy: (seconds: number) => void;
}

/**
 * Shown only when the IFrame API never loads: a bare embed keeps YouTube's own
 * controls, so the tracks stay playable even with no transport of our own.
 */
function FallbackEmbed({ track }: Readonly<{ track: Track }>) {
  const separator = track.src.includes("?") ? "&" : "?";
  const src = track.start
    ? `${track.src}${separator}start=${track.start}`
    : track.src;

  return (
    <iframe
      title={`Track player for ${track.title}`}
      src={src}
      width="100%"
      height="300"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope; web-share"
      loading="lazy"
      className="block"
      style={{ border: 0 }}
    />
  );
}

export const TrackPlayer = forwardRef<
  TrackPlayerHandle,
  { readonly tracks: Track[] }
>(({ tracks }, ref) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  // Non-null only while a pointer is dragging the seek bar; the real seek is
  // committed on release so we aren't hammering seekTo on every mousemove.
  const [scrubbing, setScrubbing] = useState<number | null>(null);

  const hostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  /**
   * The IFrame API attaches a player's methods when the iframe finishes its
   * handshake — `new YT.Player()` returns well before that, and `destroy()`
   * strips them off again — so a non-null ref is not on its own something you
   * can drive. Anything landing in that window (the position poll, a transport
   * key, a click on the video) would otherwise call through to nothing. One
   * probe stands in for the whole transport because the API attaches all of it
   * at once.
   */
  const livePlayer = useCallback((): YouTubePlayer | null => {
    const player = playerRef.current;
    return typeof player?.getCurrentTime === "function" ? player : null;
  }, []);

  // The IFrame API holds its event callbacks for the player's whole lifetime,
  // so they read live values through refs instead of closing over the render
  // that happened to create the player.
  const tracksRef = useRef(tracks);
  const indexRef = useRef(index);
  const playingRef = useRef(playing);

  const track = tracks[index];
  const atStart = index === 0;
  const atEnd = index === tracks.length - 1;

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, tracks.length - 1)),
    [tracks.length],
  );
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);
  const nextRef = useRef(next);

  // Declared ahead of every other effect so the rest of them, and any callback
  // the API fires, see the values from the render that just committed.
  useEffect(() => {
    tracksRef.current = tracks;
    indexRef.current = index;
    playingRef.current = playing;
    nextRef.current = next;
  });

  const toggle = useCallback(() => {
    const player = livePlayer();
    if (!player) return;
    // `playing` is only ever set from onStateChange, so the button reflects what
    // the player is actually doing rather than what we asked it to do.
    if (playingRef.current) player.pauseVideo();
    else player.playVideo();
  }, [livePlayer]);

  const seekTo = useCallback((seconds: number) => {
    const player = livePlayer();
    if (!player) return;
    const target = Math.max(0, seconds);
    player.seekTo(target, true);
    setPosition(target);
  }, [livePlayer]);

  const seekBy = useCallback(
    (delta: number) => {
      const player = livePlayer();
      if (!player) return;
      seekTo(player.getCurrentTime() + delta);
    },
    [livePlayer, seekTo],
  );

  useImperativeHandle(ref, () => ({ next, prev, toggle, seekBy }), [
    next,
    prev,
    toggle,
    seekBy,
  ]);

  const handleStateChange = useCallback((state: number) => {
    const player = livePlayer();
    switch (state) {
      case PLAYER_STATE.PLAYING:
        setPlaying(true);
        setDuration(player?.getDuration() || null);
        break;
      case PLAYER_STATE.PAUSED:
        setPlaying(false);
        break;
      case PLAYER_STATE.ENDED:
        // Roll into the next track the way a playlist would; stop on the last.
        if (indexRef.current < tracksRef.current.length - 1) nextRef.current();
        else setPlaying(false);
        break;
    }
  }, [livePlayer]);

  // One player for the whole session — switching tracks swaps the video inside
  // it, which is what lets playback carry across a skip.
  useEffect(() => {
    let cancelled = false;
    const first = tracksRef.current[0];

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return;
        playerRef.current = new YT.Player(hostRef.current, {
          videoId: youtubeId(first.src),
          width: "100%",
          height: "300",
          playerVars: {
            controls: 0, // the caption bar below is the transport
            disablekb: 1, // keys are routed in from the command line
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin,
            start: first.start ?? 0,
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              setReady(true);
              // The player is only ever mounted by /prime-track-ids, so the
              // command that created it doubles as the gesture that starts
              // playback. If the browser's autoplay policy blocks it, the
              // state never turns PLAYING and the transport just shows Play.
              playerRef.current?.playVideo();
            },
            onStateChange: (event) => {
              if (!cancelled) handleStateChange(event.data);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      setReady(false);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [handleStateChange]);

  // Track 0 is already in the player from construction, so this only fires on a
  // real skip — otherwise becoming ready would restart the first track.
  const loadedIndexRef = useRef(0);
  useEffect(() => {
    const player = livePlayer();
    if (!player || !ready || loadedIndexRef.current === index) return;
    loadedIndexRef.current = index;

    const upcoming = tracksRef.current[index];
    const options = {
      videoId: youtubeId(upcoming.src),
      startSeconds: upcoming.start ?? 0,
    };
    setPosition(upcoming.start ?? 0);
    setDuration(null);
    // Skipping while paused stays paused; skipping mid-track keeps playing.
    if (playingRef.current) player.loadVideoById(options);
    else player.cueVideoById(options);
  }, [index, livePlayer, ready]);

  // The API pushes state changes but not time, so the position has to be polled.
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      const player = livePlayer();
      if (!player) return;
      setPosition(player.getCurrentTime());
      setDuration((current) => current ?? (player.getDuration() || null));
    }, 250);
    return () => clearInterval(timer);
  }, [livePlayer, playing]);

  const displayed = scrubbing ?? position;
  const progress = duration ? Math.min(100, (displayed / duration) * 100) : 0;

  const positionFromPointer = (clientX: number): number | null => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect?.width || !duration) return null;
    const fraction = (clientX - rect.left) / rect.width;
    return Math.min(1, Math.max(0, fraction)) * duration;
  };

  const handleBarPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = positionFromPointer(event.clientX);
    if (target === null) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setScrubbing(target);
  };

  const handleBarPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scrubbing === null) return;
    const target = positionFromPointer(event.clientX);
    if (target !== null) setScrubbing(target);
  };

  const handleBarPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scrubbing === null) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    seekTo(scrubbing);
    setScrubbing(null);
  };

  // Covers the plain-click case as well as environments without pointer events;
  // after a drag it lands on the position the release already sought to.
  const handleBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (scrubbing !== null) return;
    const target = positionFromPointer(event.clientX);
    if (target !== null) seekTo(target);
  };

  const handleBarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    seekBy(event.key === "ArrowLeft" ? -SEEK_STEP : SEEK_STEP);
  };

  const transportClass =
    "p-2 disabled:opacity-30 enabled:hover:text-white enabled:cursor-pointer";

  return (
    <div className="py-2">
      <div className="relative w-full h-[300px] bg-neutral-950 overflow-hidden border border-b-0 border-neutral-800">
        {failed ? (
          <FallbackEmbed track={track} />
        ) : (
          <>
            {/* Wrapper stays put: the API replaces the inner node with its iframe.
                That iframe arrives inline and sized by attribute, so the box has
                to force it block-level and full-bleed — inline would leave a
                baseline descender strip under the video. */}
            <div className="w-full h-full [&>iframe]:block [&>iframe]:w-full [&>iframe]:h-full">
              <div ref={hostRef} />
            </div>
            {/* The iframe would otherwise eat the click and pull focus out of the
                command line, which is what routes ↑ ↓ ← → space to this player. */}
            <button
              type="button"
              onClick={toggle}
              aria-label="Play/pause video"
              className="absolute inset-0 cursor-pointer"
            />
          </>
        )}
      </div>

      {/* The bar doubles as the rule under the video: the track sits flush against
          the frame and the rest of the hit area hangs below it, instead of a
          second hairline floating in a strip of its own. */}
      <div
        ref={barRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration ?? 0)}
        aria-valuenow={Math.floor(displayed)}
        aria-valuetext={`${formatTime(displayed)} of ${formatTime(duration)}`}
        tabIndex={0}
        onPointerDown={handleBarPointerDown}
        onPointerMove={handleBarPointerMove}
        onPointerUp={handleBarPointerUp}
        onPointerCancel={() => setScrubbing(null)}
        onClick={handleBarClick}
        onKeyDown={handleBarKeyDown}
        className="group relative flex w-full h-3 items-start border-x border-neutral-800 bg-neutral-950 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-neutral-500"
      >
        <div className="w-full h-px bg-neutral-800 transition-[height] group-hover:h-[3px] group-focus:h-[3px]">
          <div
            className="h-full bg-white transition-[width] duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="border border-t-0 border-neutral-800">
        {/* Three anchors, not two: the outer columns are equal fractions so the
            transport lands on the true centre of the bar whatever they hold. */}
        <div className="px-3 pt-3 pb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-neutral-600 text-xs leading-none tabular-nums">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(tracks.length).padStart(2, "0")}
            </span>
            <span className="text-white text-sm leading-none truncate">
              {track.title}
            </span>
            <span className="text-neutral-500 text-xs leading-none truncate">
              {track.artist}
            </span>
          </div>

          <div className="flex items-center gap-3 text-neutral-600">
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Previous track"
              className={transportClass}
            >
              <SkipBack size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={toggle}
              disabled={!ready}
              aria-label={playing ? "Pause" : "Play"}
              className={transportClass}
            >
              {playing ? (
                <Pause size={28} aria-hidden="true" />
              ) : (
                <Play size={28} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              disabled={atEnd}
              aria-label="Next track"
              className={transportClass}
            >
              <SkipForward size={20} aria-hidden="true" />
            </button>
          </div>

          <span className="justify-self-end whitespace-nowrap text-xs text-neutral-600 tabular-nums">
            {formatTime(displayed)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
});
TrackPlayer.displayName = "TrackPlayer";
