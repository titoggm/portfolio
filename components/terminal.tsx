"use client";

import React, { useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export interface Command {
  command: string;
  result?: React.ReactNode;
  sideEffect?: () => void;
}

interface Props {
  commands: Array<Command>;
  userName: string;
  machineName: string;
  initialFeed?: string;
  onCommandNotFound?: (cmd: string) => string;
  disableClearCommand?: boolean;
}

const ignoredKeys = new Set([
  "Escape", "Tab", "Enter", "Shift", "Control", "Alt", "AltGraph", "Meta",
  "CapsLock", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Backspace", "Delete", "Insert", "NumLock", "ScrollLock",
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
  "Play", "Pause", "Stop", "PreviousTrack", "NextTrack",
  "VolumeUp", "VolumeDown", "Mute", "Home", "End", "PageUp", "PageDown", "ContextMenu",
]);

const getPrompt = (line: React.ReactNode, index: number): React.ReactNode => {
  if (index % 2 === 0 && typeof line === "string") {
    const parts = line.split(" ");
    const prompt = parts[0];
    const command = parts.slice(1).join(" ");
    const promptParts = prompt.split("@");
    const userName = promptParts[0];
    const machineName = promptParts[1];
    const machineNameOnly = machineName.slice(0, -3);
    return (
      <div className="flex" key={index}>
        <span className="text-white font-bold">{userName}</span>
        <span className="text-neutral-400">@</span>
        <span className="text-neutral-300 font-bold">{machineNameOnly}</span>
        <span className="text-neutral-500">:</span>
        <span className="text-neutral-500">~</span>
        <span className="text-neutral-400 font-bold">$</span>&nbsp;
        <span>{command}</span>
      </div>
    );
  }
  return <div key={index}>{line}</div>;
};

export const Terminal = ({
  commands,
  machineName,
  userName,
  initialFeed = "Welcome to your terminal. Type `help` to see available commands.",
  onCommandNotFound = (cmd: string) => `'${cmd}': command not found.`,
  disableClearCommand,
}: Props) => {
  const trimmedUserName = userName.replaceAll(" ", "").toLowerCase();
  const trimmedMachineName = machineName.replaceAll(" ", "").toLowerCase();

  const allCommands: Array<Command> = disableClearCommand
    ? commands
    : [...commands, { command: "clear" }];

  const [output, setOutput] = useState<Array<React.ReactNode | undefined>>([]);
  const [focused, setFocused] = useState(true);
  const [currentLine, setCurrentLine] = useState<string>("");
  const [caretBlinking, setCaretBlinking] = useState(false);

  const wrapperRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const caretIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Real terminals hold the caret solid while you type and only resume
  // blinking once you've paused, instead of blinking on every keystroke.
  const resetCaretIdleTimer = () => {
    setCaretBlinking(false);
    if (caretIdleTimer.current) clearTimeout(caretIdleTimer.current);
    caretIdleTimer.current = setTimeout(() => setCaretBlinking(true), 500);
  };

  useEffect(() => {
    return () => {
      if (caretIdleTimer.current) clearTimeout(caretIdleTimer.current);
    };
  }, []);

  const setCaretPosition = () => {
    const caretPosition = inputRef.current?.value.length || 0;
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.selectionStart = caretPosition;
        inputRef.current.selectionEnd = caretPosition;
      }
    }, 0);
  };

  const handleCommand = (event: React.KeyboardEvent<HTMLInputElement>) => {
    resetCaretIdleTimer();
    if (event.key === "Backspace") return setCurrentLine(currentLine.substring(0, currentLine.length));
    if (event.key === "Enter") {
      processCommand(currentLine);
      return setCurrentLine("");
    }
  };

  const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
    event.preventDefault();
    resetCaretIdleTimer();
    const value = event.currentTarget.value;
    if (!ignoredKeys.has(value)) {
      setCaretPosition();
      setCurrentLine(value);
    }
  };

  const processCommand = (cmd: string) => {
    const newOutput = [...output, `${trimmedUserName}@${trimmedMachineName}:~$ ${cmd}`];
    const foundCommand = allCommands.find((command) => command.command === cmd);

    if (foundCommand) {
      if (!disableClearCommand && foundCommand.command === "clear") return setOutput([]);
      if (foundCommand.result) newOutput.push(foundCommand.result);
      if (foundCommand.sideEffect) foundCommand.sideEffect();
    } else {
      newOutput.push(onCommandNotFound(cmd));
    }

    setOutput(newOutput);
  };

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTo({ top: wrapperRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [output]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (inputRef.current && caretRef.current && hiddenSpanRef.current) {
      const valueLength = inputRef.current?.value.length;
      const textBeforeCaret = currentLine.slice(0, valueLength || 0);
      hiddenSpanRef.current.textContent = textBeforeCaret;
      caretRef.current.style.left = `${hiddenSpanRef.current.offsetWidth}px`;
    }
  }, [currentLine]);

  const handleFocusInput = () => {
    setFocused(true);
    resetCaretIdleTimer();
    if (inputRef.current) inputRef.current.focus();
  };

  const handleBlur = () => setFocused(false);

  return (
    // The click handler only redirects focus to the real <input> below, which
    // already provides full native keyboard/touch/AT accessibility on its own.
    <div
      className="flex flex-col text-white w-full h-full font-mono text-sm"
      onClick={handleFocusInput} // NOSONAR typescript:S6848
    >
      {/* Output */}
      <div className="overflow-y-auto pt-2 px-4" ref={wrapperRef}>
        <TypeAnimation speed={90} cursor={false} sequence={[initialFeed]} />
        {output.map((line, index) => getPrompt(line, index))}
        <div className="flex relative">
          <span>
            <span className="text-white font-bold">{trimmedUserName}</span>
            <span className="text-neutral-400">@</span>
            <span className="text-neutral-300 font-bold">{trimmedMachineName}</span>
          </span>
          <span className="text-neutral-500">:</span>
          <span className="text-neutral-500">~</span>
          <span className="text-neutral-400 font-bold">$</span>&nbsp;
          <div className="flex-grow relative">
            <span id="hiddenSpan" className="invisible fixed" ref={hiddenSpanRef} />
            <input
              ref={inputRef}
              className="fixed -z-10 w-0 h-0 text-base opacity-0"
              value={currentLine}
              onKeyDown={handleCommand}
              onInput={handleInput}
              onFocus={handleFocusInput}
              onBlur={handleBlur}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              dir="ltr"
              type="text"
            />
            <div className="flex">
              <span>{currentLine}</span>
              {focused && (
                <div
                  ref={caretRef}
                  className={`absolute top-[1px] bottom-[2px] bg-neutral-300 w-[9px] ${
                    caretBlinking ? "animate-caret-blink" : ""
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
