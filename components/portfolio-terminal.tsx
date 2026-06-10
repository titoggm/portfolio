"use client";

import { useState } from "react";
import { Terminal, Command } from "@/components/terminal";
import { TitoOS } from "@/components/tito-os";

export default function PortfolioTerminal() {
  const [mode, setMode] = useState<"main" | "tito">("main");

  const commands: Array<Command> = [
    {
      command: "help",
      result: (
        <div className="py-1 space-y-1">
          <p className="text-neutral-400 mb-2">Available commands:</p>
          <div className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-1">
            <span className="text-white font-semibold">tito</span>
            <span className="text-neutral-400">TG9 v1.0 — A terminal tool for exploring Tito&apos;s work, thinking, interests, and background.</span>
            <span className="text-white font-semibold">clear</span>
            <span className="text-neutral-400">Clear the terminal</span>
            <span className="text-white font-semibold">help</span>
            <span className="text-neutral-400">Show this message</span>
          </div>
        </div>
      ),
    },
    {
      command: "tito",
      sideEffect: () => setMode("tito"),
    },
  ];

  if (mode === "tito") {
    return <TitoOS onExit={() => setMode("main")} />;
  }

  return (
    <Terminal
      commands={commands}
      userName="titogarcia999"
      machineName="portfolio"
      initialFeed="Welcome to my portfolio. Type `tito` to get started or type `help` to see available commands."
    />
  );
}
