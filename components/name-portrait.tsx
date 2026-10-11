"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import DecryptedText from "./decrypted-text";

/**
 * "Tito" in the welcome line, revealing a circular portrait on hover. Touch
 * screens have no hover, so a tap toggles it there instead.
 *
 * The name wears the same white highlight and scramble as the active command
 * suggestion, scrambling once as it appears and again on hover, so it reads as
 * something to interact with.
 *
 * The image stays mounted (just invisible) so it's already loaded by the time
 * someone hovers, instead of popping in a beat late.
 */
export function NamePortrait({ children }: Readonly<{ children: string }>) {
  const [open, setOpen] = useState(false);
  const pointerType = useRef<string>("mouse");

  return (
    <span
      className="relative inline-block cursor-default"
      onPointerEnter={(event) => {
        pointerType.current = event.pointerType;
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onClick={() => {
        if (pointerType.current !== "mouse") setOpen((o) => !o);
      }}
    >
      <span className="inline-block bg-white">
        <DecryptedText
          animateOn="inViewHover"
          sequential={false}
          revealDirection="center"
          text={children}
          speed={80}
          maxIterations={8}
          useOriginalCharsOnly
          className="text-black underline"
          encryptedClassName="text-black underline"
        />
      </span>
      <motion.span
        aria-hidden={!open}
        className="pointer-events-none absolute left-0 top-full z-20 mt-2 block size-32 overflow-hidden rounded-full border-[3px] border-black bg-neutral-900 ring-[3px] ring-neutral-500"
        initial={false}
        animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{ transformOrigin: "top left" }}
      >
        {/* A square crop of profile.jpeg made at full resolution, rather than
            zooming the whole photo in CSS: the optimizer sizes its output to
            the 128px box, so a CSS zoom would upscale an already-small file. */}
        <Image
          src="/profile-portrait.jpeg"
          alt="Portrait of Tito"
          fill
          sizes="128px"
          quality={90}
          priority
          className="object-cover"
        />
      </motion.span>
    </span>
  );
}
