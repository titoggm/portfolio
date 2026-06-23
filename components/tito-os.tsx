"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import DecryptedText from "./decrypted-text";
import {
  ProjectsOverlay,
  type ProjectsOverlayHandle,
} from "./projects-overlay";

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
    name: "prime-resume",
    description: "View Tito's resume",
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

const LINKEDIN_URL = "https://www.linkedin.com/in/titoggm";
const RESUME_URL = "/tg9-resume.pdf";
const EMAIL = "titogm9@gmail.com";

// ---------------------------------------------------------------------------
// Track player
// ---------------------------------------------------------------------------

interface Track {
  src: string;
  title: string;
  artist: string;
  start?: number; // start time in seconds
}

const TRACKS: Track[] = [
  {
    src: "https://www.youtube.com/embed/PHEbmPRBuU8?si=Lf8eVViO19JAHkVP",
    title: "Spirit Wave",
    artist: "Mall Grab",
  },
  {
    src: "https://www.youtube.com/embed/8tkFXU2xS6Q?si=OoeFKNAUOi72z5nZ",
    title: "Builded Mind",
    artist: "Ron Obvious",
    start: 108,
  },
  {
    src: "https://www.youtube.com/embed/os9WVfGR6uE?si=RcnQAsPDWai8DYB2",
    title: "The Only Girl",
    artist: "Faster Horses",
  },
  {
    src: "https://www.youtube.com/embed/yxW3R2us0r0?si=UsrJWi6gbvKlaKGq",
    title: "Slow Burner (Effy Remix)",
    artist: "Interplanetary Criminal, Effy",
  },
  {
    src: "https://www.youtube.com/embed/W_LlRsvdebI?si=3qI0yx4oi3xOxNHT",
    title: "Make You Whole (Dusky Remix)",
    artist: "Andronicus, Dusky",
  },
  {
    src: "https://www.youtube.com/embed/xJIYF6KwK3w?si=_MSN0QpDEz5GNfiX",
    title: "Dreams",
    artist: "Prospa",
  },
  {
    src: "https://www.youtube.com/embed/-1PgQkGPQXE?si=tm0RhUXFeyXFZ4QB",
    title: "More Than I Can Take (Y Tribe Instrumental)",
    artist: "Absolute",
  },
  {
    src: "https://www.youtube.com/embed/dp2BhqQtenc?si=Ql9cel6t1tJw8Dce",
    title: "Salzburg",
    artist: "Sam Alfred",
  },
  {
    src: "https://www.youtube.com/embed/_14ZfyhB_ew?si=MrmiY4KDr01u_Mi8",
    title: "Don't Hurt Me",
    artist: "Cache",
  },
  {
    src: "https://www.youtube.com/embed/hoFhIm4ppnA?si=oPXE4mwiOqApkR78",
    title: "Everywhere",
    artist: "Lxury",
  },
  {
    src: "https://www.youtube.com/embed/wuRXPhrABJY?si=GVf3Vt0tMTKai8XS",
    title: "Aqueous Regression",
    artist: "Dakpa",
  },
  {
    src: "https://www.youtube.com/embed/wuRXPhrABJY?si=GVf3Vt0tMTKai8XS",
    title: "Aqueous Regression",
    artist: "Dakpa",
  },
];

interface TrackPlayerHandle {
  next: () => void;
  prev: () => void;
}

function TrackEmbed({ track }: { readonly track: Track }) {
  const [loaded, setLoaded] = useState(false);

  let src = track.src;
  if (track.start) {
    const separator = track.src.includes("?") ? "&" : "?";
    src = `${track.src}${separator}start=${track.start}`;
  }

  return (
    <div className="relative w-full h-[300px] bg-neutral-950 overflow-hidden border border-b-0 border-neutral-800">
      <iframe
        title={`Track player for ${track.title}`}
        src={src}
        width="100%"
        height="300"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope; web-share"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`block transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ border: 0 }}
      />
    </div>
  );
}

const TrackPlayer = forwardRef<TrackPlayerHandle, { tracks: Track[] }>(
  ({ tracks }, ref) => {
    const [index, setIndex] = useState(0);

    const next = useCallback(
      () => setIndex((i) => Math.min(i + 1, tracks.length - 1)),
      [tracks.length]
    );
    const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

    useImperativeHandle(ref, () => ({ next, prev }), [next, prev]);

    const track = tracks[index];

    return (
      <div className="py-2">
        {/* Full-width embed */}
        <TrackEmbed key={track.src} track={track} />

        {/* Caption bar */}
        <div className="border border-t-0 border-neutral-800 px-3 py-4 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm leading-none">{track.title}</span>
            <span className="text-neutral-500 text-xs leading-none">{track.artist}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-600 shrink-0">
            <span>
              {String(index + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous track"
                className="p-1 disabled:opacity-30 enabled:hover:text-white enabled:cursor-pointer"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index === tracks.length - 1}
                aria-label="Next track"
                className="p-1 disabled:opacity-30 enabled:hover:text-white enabled:cursor-pointer"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
TrackPlayer.displayName = "TrackPlayer";

// ---------------------------------------------------------------------------
// TitoOS
// ---------------------------------------------------------------------------

interface OutputItem {
  id: number;
  node: React.ReactNode;
}

const INITIAL_OUTPUT: OutputItem[] = [
  {
    id: 1,
    node: (
      <p className="text-neutral-300">
        TG9 v1.1.192 
      </p>
    ),
  },
];

interface Props {
  readonly onExit: () => void;
}

export function TitoOS({ onExit }: Readonly<Props>) {
  const [focused, setFocused] = useState(true);
  const [currentLine, setCurrentLine] = useState("/");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playerActive, setPlayerActive] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [output, setOutput] = useState<OutputItem[]>(INITIAL_OUTPUT);
  const [caretBlinking, setCaretBlinking] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);
  const activePlayerRef = useRef<TrackPlayerHandle | null>(null);
  const projectsOverlayRef = useRef<ProjectsOverlayHandle | null>(null);
  const caretIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          <span key="name-1" className="text-white text-[15px]">
            Tito Garcia
          </span>,
          <span key="gap-1" className="block h-2" />,
          <span key="bio-1" className="text-neutral-300 leading-relaxed">
            I was born in Puerto Rico and grew up in Boston, Massachusetts.
          </span>,
          <span key="gap-1b" className="block h-2" />,
          <span key="bio-2" className="text-neutral-300 leading-relaxed">
            Creativity, curiosity, and interdisciplinarity guide how I work.
          </span>,
          <span key="gap-2" className="block h-2" />,
          <span key="bio-3" className="text-neutral-300 leading-relaxed">
            I come from a background of different cultures and exploration
            across domains such as computer science, design, psychology, and
            architecture, which have shaped my taste and the way I think and
            solve problems as a builder and creative.
          </span>,
          <span key="gap-3" className="block h-2" />,
          <span key="bio-4" className="text-neutral-300 leading-relaxed">
            I work at the intersection of design, AI, and engineering. I
            enjoy creating systems and user experiences designed for human
            and AI collaboration. What excites me most is combining strong
            design principles with agentic design and engineering skills to
            optimize design and code workflows.
          </span>,
          <span key="gap-4" className="block h-2" />,
          <span key="reach-1" className="text-neutral-300">
            <span className="text-neutral-400">/prime-linkedin</span>
            {" · "}
            <span className="text-neutral-400">/prime-email</span>
            {" · "}
            <span className="text-neutral-400">/prime-resume</span>
          </span>,
          <span key="gap-5" className="block h-3" />,
        ];
        lines.forEach((node, i) => {
          setTimeout(() => appendOutput(node), i * 60);
        });
        break;
      }

      case "prime-resume":
        window.open(RESUME_URL, "_blank", "noopener,noreferrer");
        appendOutput(
          <span className="text-neutral-300">
            Opening resume...{" "}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-neutral-300"
            >
              {RESUME_URL}
            </a>
          </span>
        );
        appendOutput(
          <span className="text-neutral-500 text-sm">
            ps — the resume has my full name, but friends, coworkers, and
            this terminal call me Tito.
          </span>
        );
        break;

      case "prime-track-ids": {
        if (playerActive) {
          appendOutput(
            <span className="text-neutral-500">
              player already running — use ↑ ↓ to navigate tracks.
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
        setShowProjects(true);
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

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Returns true once a handler has fully handled (and should stop) the event.
  const handleProjectsOverlayKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): boolean => {
    if (!showProjects || !projectsOverlayRef.current) return false;

    if (event.key === "Escape") {
      event.preventDefault();
      setShowProjects(false);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      projectsOverlayRef.current.prevProject();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      projectsOverlayRef.current.nextProject();
    }
    return true;
  };

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

  // Route arrow keys to the track player when no suggestions are open
  const handlePlayerKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): boolean => {
    if (showSuggestions || !activePlayerRef.current) return false;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        activePlayerRef.current.prev();
        return true;
      case "ArrowDown":
        event.preventDefault();
        activePlayerRef.current.next();
        return true;
      default:
        return false;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    resetCaretIdleTimer();

    if (event.ctrlKey && event.key === "c") {
      event.preventDefault();
      onExit();
      return;
    }

    if (handleProjectsOverlayKeyDown(event)) return;
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
    if (inputRef.current) inputRef.current.focus();
  }, [resetCaretIdleTimer]);

  const handleBlur = () => {
    requestAnimationFrame(() => {
      if (inputRef.current && document.hasFocus()) {
        inputRef.current.focus();
      } else {
        setFocused(false);
      }
    });
  };

  // Clicking or tapping anywhere in the terminal pane refocuses the hidden
  // input, mirroring how a native terminal grabs focus.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousedown", handleFocus);
    container.addEventListener("touchstart", handleFocus);
    return () => {
      container.removeEventListener("mousedown", handleFocus);
      container.removeEventListener("touchstart", handleFocus);
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
        <div className="px-4 py-1 text-sm text-neutral-500">
          / for available commands · ctrl+c to exit
        </div>
      </div>

      {/* Projects overlay */}
      <AnimatePresence>
        {showProjects && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectsOverlay
              ref={projectsOverlayRef}
              onClose={() => setShowProjects(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
