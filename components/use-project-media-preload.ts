"use client";

import { getImageProps } from "next/image";
import { useEffect } from "react";
import { preload } from "react-dom";
import { PROJECTS } from "@/lib/projects";
import { PROJECT_IMAGE_PROPS } from "./project-card";

/**
 * Project cards do not exist until `/prime-projects` runs, so `priority` on the
 * `<Image>` buys nothing — the request only starts once the card mounts, and the
 * image visibly pops in after it. Warm the same optimizer URLs on page load
 * instead: the command takes seconds to type, by which point the bytes are in
 * the HTTP cache and the card paints complete on its first frame.
 *
 * `fetchPriority: "low"` keeps this behind the terminal's own first paint; the
 * typing delay leaves more than enough room for it to finish.
 */
export function useProjectMediaPreload() {
  useEffect(() => {
    for (const { image, imageAlt } of PROJECTS) {
      if (!image) continue;

      const { props } = getImageProps({
        ...PROJECT_IMAGE_PROPS,
        src: image,
        alt: imageAlt,
      });

      preload(props.src, {
        as: "image",
        imageSrcSet: props.srcSet,
        imageSizes: props.sizes,
        fetchPriority: "low",
      });
    }
  }, []);
}
