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
import DecryptedText from "./DecryptedText";
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
      "Gain a general understanding of Tito's background and interests",
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
    name: "prime-work-experience",
    description: "Browse through Tito's work experience",
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
const EMAIL = "titogm9@gmail.com";

// ---------------------------------------------------------------------------
// Track player
// ---------------------------------------------------------------------------

interface Track {
  src: string;
  title: string;
  artist: string;
}

const TRACKS: Track[] = [
  {
    src: "https://www.youtube.com/embed/yxW3R2us0r0?si=UsrJWi6gbvKlaKGq",
    title: "Slow Burner (Effy Remix)",
    artist: "Interplanetary Criminal, Effy",
  },
  {
    src: "https://www.youtube.com/embed/jCVrjYxoqBg?si=7P4RpVkA8rJ27yFZ",
    title: "New York",
    artist: "Mall Grab",
  },
  {
    src: "https://www.youtube.com/embed/LUApGPHWnuo?si=xtRW6EmhZgc6SgFC",
    title: "Days In The Sun (Forester Remix)",
    artist: "Forester, Ziggy Alberts",
  },
  {
    src: "https://www.youtube.com/embed/xJIYF6KwK3w?si=_MSN0QpDEz5GNfiX",
    title: "Dreams",
    artist: "Prospa",
  },
  {
    src: "https://www.youtube.com/embed/L9PPdpDINUU?si=9uUA3ivoZG1CE1ta",
    title: "Slamb",
    artist: "Inner Child",
  },
  {
    src: "https://www.youtube.com/embed/yHtckvNmXUA?si=MyPqV4t69mgNWcHW",
    title: "Break It Down",
    artist: "Braga Circuit",
  },
  {
    src: "https://www.youtube.com/embed/p2b-Kmg9Peo?si=sD7Kszo8erMXMbOX",
    title: "Circles (Track 1)",
    artist: "Kerri Chandler ft Natalia Kissoon",
  },
  {
    src: "https://www.youtube.com/embed/6QWS8mKq6us?si=8vaqWrGLh1FCKBVy",
    title: "Dermot (See Yourself In My Eyes)",
    artist: "Fred Again.., Dermot Kennedy",
  },
  {
    src: "https://www.youtube.com/embed/4UNonFF4TN8?si=YKllPawstzDDp7B7",
    title: "Camellia",
    artist: "Aldonna, Dusky",
  },
];

interface TrackPlayerHandle {
  next: () => void;
  prev: () => void;
}

function TrackEmbed({ track }: { readonly track: Track }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-[300px] bg-neutral-950 overflow-hidden">
      <iframe
        title={`Track player for ${track.title}`}
        src={track.src}
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
        <div className="border border-t-0 border-neutral-800 px-3 py-2 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <DecryptedText
              key={`title-${index}`}
              animateOn="view"
              sequential={false}
              revealDirection="center"
              text={track.title}
              speed={80}
              maxIterations={4}
              useOriginalCharsOnly
              className="text-white text-sm leading-none"
              encryptedClassName="text-neutral-600 text-sm leading-none"
            />
            <DecryptedText
              key={`artist-${index}`}
              animateOn="view"
              sequential={false}
              revealDirection="center"
              text={track.artist}
              speed={80}
              maxIterations={4}
              useOriginalCharsOnly
              className="text-neutral-500 text-xs leading-none"
              encryptedClassName="text-neutral-700 text-xs leading-none"
            />
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
        [ TG9 ] v1.0 — A terminal tool for exploring Tito&apos;s work, thinking, interests, and background.
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

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);
  const activePlayerRef = useRef<TrackPlayerHandle | null>(null);
  const projectsOverlayRef = useRef<ProjectsOverlayHandle | null>(null);

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
          <span key="gap-0" />,
          <span key="bio-1" className="text-neutral-300 leading-relaxed">
            Hey, I&apos;m Tito — an interdisciplinary product designer working across design, AI, and engineering.
          </span>,
          <span key="gap-1" />,
          <div key="phil-1" className="flex gap-4">
            <span className="text-neutral-500 shrink-0 w-24">philosophy</span>
            <span className="text-neutral-300">
              Create systems designed for human and AI collaboration.
            </span>
          </div>,
          <div key="edu-1" className="flex gap-4">
            <span className="text-neutral-500 shrink-0 w-24">education</span>
            <span className="text-neutral-300">
              Computational Psychology · Colby College
            </span>
          </div>,
          <div key="int-1" className="flex gap-4">
            <span className="text-neutral-500 shrink-0 w-24">interests</span>
            <span className="text-neutral-300">
              Agentic design &amp; engineering · DJing &amp; vinyl · Wake surfing
            </span>
          </div>,
          <span key="gap-2" />,
          <div key="reach-1" className="flex gap-4">
            <span className="text-neutral-500 shrink-0 w-24">reach out</span>
            <span className="text-neutral-300">
              <span className="text-white">/prime-email</span>
              {" · "}
              <span className="text-white">/prime-linkedin</span>
            </span>
          </div>,
          <span key="gap-3" />,
        ];
        lines.forEach((node, i) => {
          setTimeout(() => appendOutput(node), i * 60);
        });
        break;
      }

      case "prime-work-experience": {
        const lines: React.ReactNode[] = [
          <span key="gap-0" />,
          <span key="rv-company" className="text-white">Red Ventures</span>,
          <span key="rv-meta" className="text-neutral-500">
            Product Designer <span className="text-neutral-700">·</span> Aug 2024 — Present
          </span>,
          <span key="gap-1" />,
          <span key="nb-company" className="text-white">Nave Bank</span>,
          <span key="nb-meta" className="text-neutral-500">
            Design Intern <span className="text-neutral-700">·</span> Jun 2023 — Jul 2023
          </span>,
          <span key="gap-2" />,
        ];
        lines.forEach((node, i) => {
          setTimeout(() => appendOutput(node), i * 70);
        });
        break;
      }

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
        window.open(LINKEDIN_URL, "_blank");
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key === "c") {
      event.preventDefault();
      onExit();
      return;
    }

    if (showProjects && projectsOverlayRef.current) {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowProjects(false);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        projectsOverlayRef.current.prevProject();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        projectsOverlayRef.current.nextProject();
        return;
      }
      return;
    }

    if (showSuggestions) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setCurrentLine("");
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
        setCurrentLine("");
        return;
      }
    }

    // Route arrow keys to the track player when no suggestions are open
    if (!showSuggestions && activePlayerRef.current) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        activePlayerRef.current.prev();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        activePlayerRef.current.next();
        return;
      }
    }

    if (event.key === "Enter") {
      setCurrentLine("");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLine(event.currentTarget.value);
  };

  const handleFocus = () => {
    setFocused(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleBlur = () => {
    requestAnimationFrame(() => {
      if (inputRef.current && document.hasFocus()) {
        inputRef.current.focus();
      } else {
        setFocused(false);
      }
    });
  };

  return (
    <div
      className="relative flex flex-col text-white bg-neutral-950 w-full h-full font-mono"
      onMouseDown={handleFocus}
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
              className="absolute bottom-full left-0 right-0 pb-2 mb-px bg-neutral-950"
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
              <span className="inline-block bg-white w-[10px] h-[1em] animate-caret-blink" />
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
