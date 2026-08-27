"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TRACKS } from "@/lib/tracks";
import DecryptedText from "./decrypted-text";
import { ProjectCards } from "./project-cards";
import { SEEK_STEP, TrackPlayer, type TrackPlayerHandle } from "./track-player";

interface CLICommand {
  name: string;
  description: string;
}

const COMMANDS: CLICommand[] = [
  {
    name: "prime-about",
    description:
      "Gain a general understanding of Tito",
  },
  {
    name: "prime-track-ids",
    description: "Browse Tito's favorite tracks",
  },
  {
    name: "prime-projects",
    description: "View selected projects and creative work by Tito",
  },
  {
    name: "prime-linkedin",
    description: "View Tito's LinkedIn profile",
  },
  {
    name: "prime-email",
    description: "Send Tito an email",
  },
  {
    name: "clear",
    description: "Starts a new session with empty context",
  },
];

const ABOUT_PROSE =
  "block max-w-[76ch] text-neutral-300 leading-relaxed";

const LINKEDIN_URL = "https://www.linkedin.com/in/titoggm";
const EMAIL = "titogm9@gmail.com";

// ---------------------------------------------------------------------------
// TitoOS
// ---------------------------------------------------------------------------

const HINT_ICON = "inline-block size-[1em] shrink-0";

/**
 * The key hints for the track player. The arrows are icons rather than ↑ ↓ ← →
 * characters because the Fira Code subset the site loads has no arrow glyphs —
 * those fall back to a system face that draws them far longer than the text
 * around them. Lucide's arrows are SVG, so they scale with the font size.
 */
function PlayerHints() {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <ArrowUp className={HINT_ICON} aria-hidden="true" />
      <ArrowDown className={HINT_ICON} aria-hidden="true" />
      <span className="sr-only">up and down arrows</span>
      <span>tracks</span>
      <span aria-hidden="true">·</span>
      <span>space play/pause</span>
      <span aria-hidden="true">·</span>
      <ArrowLeft className={HINT_ICON} aria-hidden="true" />
      <ArrowRight className={HINT_ICON} aria-hidden="true" />
      <span className="sr-only">left and right arrows</span>
      <span>seek</span>
    </span>
  );
}

// True while the user has an actual highlight on the page (a drag that covered
// text), as opposed to a plain collapsed caret.
function hasTextSelection(): boolean {
  const selection = window.getSelection();
  return !!selection && !selection.isCollapsed && selection.toString() !== "";
}

interface OutputItem {
  id: number;
  node: React.ReactNode;
}

const INITIAL_OUTPUT: OutputItem[] = [
  {
    id: 1,
    node: (
      <div className="text-neutral-300">
        <p>TG9 v1.1.192</p>
        <p>Tito Garcia</p>
        <p>Welcome to my personal portfolio</p>
      </div>
    ),
  },
];

export function TitoOS() {
  const [focused, setFocused] = useState(true);
  const [currentLine, setCurrentLine] = useState("/");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playerActive, setPlayerActive] = useState(false);
  const [output, setOutput] = useState<OutputItem[]>(INITIAL_OUTPUT);
  const [caretBlinking, setCaretBlinking] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);
  const activePlayerRef = useRef<TrackPlayerHandle | null>(null);
  const caretIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownRef = useRef(false);

  // Real terminals hold the caret solid while you type and only resume
  // blinking once you've paused, instead of blinking on every keystroke.
  const resetCaretIdleTimer = useCallback(() => {
    setCaretBlinking(false);
    if (caretIdleTimer.current) clearTimeout(caretIdleTimer.current);
    caretIdleTimer.current = setTimeout(() => setCaretBlinking(true), 500);
  }, []);

  useEffect(() => {
    return () => {
      if (caretIdleTimer.current) clearTimeout(caretIdleTimer.current);
    };
  }, []);

  const isCommandMode = currentLine.startsWith("/");
  const query = isCommandMode ? currentLine.slice(1).toLowerCase() : "";
  const filteredCommands = isCommandMode
    ? COMMANDS.filter((cmd) => cmd.name.toLowerCase().includes(query))
    : [];
  const showSuggestions = isCommandMode && filteredCommands.length > 0;

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedIndex(0);
  }

  const appendOutput = (node: React.ReactNode) => {
    setOutput((prev) => [...prev, { id: nextId.current++, node }]);
  };

  const executeCommand = (cmd: CLICommand) => {
    appendOutput(<span className="text-neutral-500">/{cmd.name}</span>);

    switch (cmd.name) {
      case "prime-about": {
        const lines: React.ReactNode[] = [
          <span key="gap-0" className="block h-2" />,
          <span key="bio-1" className={ABOUT_PROSE}>
            Hey, I’m Tito, an AI-Native Product Designer from Puerto Rico
            and Boston, Massachusetts.
          </span>,
          <span key="gap-1b" className="block h-2" />,
          <span key="bio-2" className={ABOUT_PROSE}>
            I enjoy thinking in systems and creating efficient, high-quality
            design workflows that help create and scale thoughtful product
            experiences. I focus on understanding where AI can replace a
            designer’s effort and where a designer’s judgment remains
            irreplaceable.
          </span>,
          <span key="gap-2" className="block h-2" />,
          <span key="bio-3" className={ABOUT_PROSE}>
            I’ve always been drawn to different disciplines, from design and
            computer science to psychology and architecture. Exploring them has
            shaped my taste, how I approach problems, and ultimately how I’ve
            grown into both a creative and a builder.
          </span>,
          <span key="gap-3" className="block h-2" />,
          <span key="bio-4" className={ABOUT_PROSE}>
            Run <span className="text-neutral-400">/prime-projects</span> to see
            some of my favourite work.
          </span>,
          <span key="gap-4" className="block h-2" />,
          <span key="bio-5" className={ABOUT_PROSE}>
            Outside of design, I’m a music collector and selector, digging
            through vinyl crates, YouTube, and Bandcamp for house and UK garage
            tracks. The best part is finding hidden gems that don’t have much
            of an audience but are seriously good. Run{" "}
            <span className="text-neutral-400">/prime-track-ids</span> to listen
            to some of what I’m currently listening to.
          </span>,
          <span key="gap-5" className="block h-2" />,
          <span key="reach-1" className={ABOUT_PROSE}>
            If you’re working on something interesting, want to talk design or
            AI, or just want to say hi, run{" "}
            <span className="text-neutral-400">/prime-linkedin</span> or{" "}
            <span className="text-neutral-400">/prime-email</span>. Always down
            to connect and build something cool.
          </span>,
          <span key="gap-6" className="block h-3" />,
        ];
        lines.forEach((node, i) => {
          setTimeout(() => appendOutput(node), i * 60);
        });
        break;
      }

      case "prime-track-ids": {
        if (playerActive) {
          appendOutput(
            <span className="text-neutral-500">
              player already running — <PlayerHints />
            </span>
          );
          break;
        }
        setPlayerActive(true);
        appendOutput(<TrackPlayer ref={activePlayerRef} tracks={TRACKS} />);
        break;
      }

      case "prime-linkedin":
        window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
        appendOutput(
          <span className="text-neutral-300">
            Opening LinkedIn profile...{" "}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-neutral-300"
            >
              {LINKEDIN_URL}
            </a>
          </span>
        );
        break;

      case "prime-email":
        window.open(`mailto:${EMAIL}`, "_self");
        appendOutput(
          <span className="text-neutral-300">
            Opening email client...{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="underline text-white hover:text-neutral-300"
            >
              {EMAIL}
            </a>
          </span>
        );
        break;

      case "prime-projects":
        appendOutput(<ProjectCards />);
        appendOutput(
          <span className="block pb-2 text-neutral-500">
            adding more of my projects soon — T
          </span>
        );
        break;

      case "clear":
        nextId.current = 1;
        setPlayerActive(false);
        activePlayerRef.current = null;
        setOutput(INITIAL_OUTPUT);
        break;
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // The caret is drawn as a span after the text, so the input's real selection
  // has to sit at the end too. A bare .focus() puts it at index 0, where
  // backspace has nothing to its left and the leading "/" can't be deleted.
  const focusInputAtEnd = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    const end = input.value.length;
    input.setSelectionRange(end, end);
  }, []);

  useEffect(() => {
    focusInputAtEnd();
  }, [focusInputAtEnd]);

  // Returns true once a handler has fully handled (and should stop) the event.
  const handleSuggestionsKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): boolean => {
    if (!showSuggestions) return false;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
        return true;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return true;
      case "Escape":
        event.preventDefault();
        setCurrentLine("");
        return true;
      case "Enter":
        event.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
        setCurrentLine("");
        return true;
      default:
        return false;
    }
  };

  // Drive the track player from the command line whenever no suggestions are
  // open. Space is only claimed on an empty line so it stays a plain character
  // while a command is being typed.
  const handlePlayerKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): boolean => {
    const player = activePlayerRef.current;
    if (showSuggestions || !player) return false;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        player.prev();
        return true;
      case "ArrowDown":
        event.preventDefault();
        player.next();
        return true;
      case "ArrowLeft":
        event.preventDefault();
        player.seekBy(-SEEK_STEP);
        return true;
      case "ArrowRight":
        event.preventDefault();
        player.seekBy(SEEK_STEP);
        return true;
      case " ":
        if (currentLine !== "") return false;
        event.preventDefault();
        player.toggle();
        return true;
      default:
        return false;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    resetCaretIdleTimer();

    if (handleSuggestionsKeyDown(event)) return;
    if (handlePlayerKeyDown(event)) return;

    if (event.key === "Enter") {
      setCurrentLine("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLine(event.currentTarget.value);
  };

  const handleFocus = useCallback(() => {
    setFocused(true);
    resetCaretIdleTimer();
    focusInputAtEnd();
  }, [resetCaretIdleTimer, focusInputAtEnd]);

  const handleBlur = () => {
    // A press blurs the input before the drag has selected anything, so the
    // selection can't be consulted yet — refocusing here would cancel the drag
    // in progress. The pointer-up handler below restores focus instead.
    if (pointerDownRef.current) {
      setFocused(false);
      return;
    }
    requestAnimationFrame(() => {
      if (inputRef.current && document.hasFocus() && !hasTextSelection()) {
        focusInputAtEnd();
      } else {
        setFocused(false);
      }
    });
  };

  // Clicking or tapping anywhere in the terminal pane refocuses the hidden
  // input, mirroring how a native terminal grabs focus. Focus is taken on
  // release rather than press, and only when the gesture didn't highlight
  // anything, so a click-drag can select output text and keep it.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePress = () => {
      pointerDownRef.current = true;
    };
    // Bound to the window: a drag often ends outside the pane it started in.
    const handleRelease = () => {
      if (!pointerDownRef.current) return;
      pointerDownRef.current = false;
      if (hasTextSelection()) return;
      handleFocus();
    };

    container.addEventListener("mousedown", handlePress);
    container.addEventListener("touchstart", handlePress);
    window.addEventListener("mouseup", handleRelease);
    window.addEventListener("touchend", handleRelease);
    return () => {
      container.removeEventListener("mousedown", handlePress);
      container.removeEventListener("touchstart", handlePress);
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("touchend", handleRelease);
    };
  }, [handleFocus]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col text-white bg-neutral-950 w-full h-full font-mono"
    >
      {/* Output area */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-2 pb-2 space-y-1 text-sm"
        ref={outputRef}
      >
        {output.map((item) => (
          <div key={item.id}>{item.node}</div>
        ))}
      </div>

      {/* Pinned input row */}
      <div className="relative">
        {/* Command suggestions — floats over output area */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              className="absolute bottom-full left-0 right-0 pt-2 pb-2 bg-neutral-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {filteredCommands.map((cmd, i) => {
                const isActive = i === selectedIndex;
                return (
                  <button
                    key={cmd.name}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(i)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      executeCommand(cmd);
                      setCurrentLine("");
                    }}
                    className="w-full pl-5 pr-4 py-1 flex items-center text-left cursor-pointer"
                  >
                    <span className="text-sm shrink-0 w-56">
                      {isActive ? (
                        <span className="inline-block bg-white">
                          <DecryptedText
                            key={selectedIndex}
                            animateOn="view"
                            sequential={false}
                            revealDirection="center"
                            text={`/${cmd.name}`}
                            speed={80}
                            maxIterations={4}
                            useOriginalCharsOnly
                            className="text-black underline"
                            encryptedClassName="text-black"
                          />
                        </span>
                      ) : (
                        <span className="text-neutral-400">/{cmd.name}</span>
                      )}
                    </span>
                    <span className="text-sm truncate">
                      {isActive ? (
                        <span className="inline-block bg-white">
                          <DecryptedText
                            key={selectedIndex}
                            animateOn="view"
                            sequential={false}
                            revealDirection="center"
                            text={cmd.description}
                            speed={80}
                            maxIterations={4}
                            useOriginalCharsOnly
                            className="text-black underline"
                            encryptedClassName="text-black"
                          />
                        </span>
                      ) : (
                        <span className="text-neutral-400">
                          {cmd.description}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="border-y border-neutral-700 pr-4 py-1 flex items-center leading-none text-sm">
          <ChevronRight
            className="text-neutral-400 mr-1r shrink-0"
            size={20}
          />
          <div className="flex-grow flex items-center">
            <input
              ref={inputRef}
              className="fixed -z-10 w-0 h-0 text-base opacity-0"
              value={currentLine}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              dir="ltr"
              type="text"
            />
            <span className="text-neutral-400">{currentLine}</span>
            {focused && (
              <span
                className={`inline-block bg-neutral-300 w-[9px] self-start ${
                  caretBlinking ? "animate-caret-blink" : ""
                }`}
                style={{ height: "1.2em" }}
              />
            )}
          </div>
        </div>
        <div className="px-4 py-1 flex flex-wrap items-center gap-1 text-sm text-neutral-500">
          <span>/ for available commands</span>
          {playerActive && (
            <>
              <span aria-hidden="true">·</span>
              <PlayerHints />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
