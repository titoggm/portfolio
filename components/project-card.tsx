import Image from "next/image";
import DecryptedText from "@/components/decrypted-text";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/lib/projects";

const MEDIA_CLASS = "w-full h-auto aspect-[16/10] object-cover";

/**
 * Shared by the rendered `<Image>` and by `useProjectMediaPreload`. Both have to
 * pass identical values: the optimizer URL is derived from them, so any drift
 * means the preload warms a URL the card never asks for.
 */
export const PROJECT_IMAGE_PROPS = {
  width: 1200,
  height: 750,
  sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  // Screenshots of dense UI: the default quality of 75 smears the small type
  // once the optimizer re-encodes to WebP/AVIF. Allowlisted in next.config.ts.
  quality: 90,
} as const;

export function ProjectCard({ project }: Readonly<{ project: Project }>) {
  const { title, description, image, imageAlt, video, href } = project;

  return (
    // Card's own padding rule keys off `>img:first-child`, which a video is not.
    <Card
      className={`relative rounded-none bg-transparent ring-neutral-800 transition-colors hover:bg-white hover:ring-white has-[a:focus-visible]:ring-neutral-400 *:[img:first-child]:rounded-t-md${
        video ? " pt-0" : ""
      }`}
    >
      {/* Direct child of Card on purpose: Card's own rules key off `>img:first-child`. */}
      {video ? (
        <video
          src={video}
          poster={image}
          aria-label={imageAlt}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={`${MEDIA_CLASS} rounded-none`}
        />
      ) : image ? (
        <Image
          {...PROJECT_IMAGE_PROPS}
          src={image}
          alt={imageAlt}
          className={MEDIA_CLASS}
        />
      ) : null}
      <CardHeader>
        <CardTitle className="text-white transition-colors group-hover/card:text-black">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} (opens in a new tab)`}
          >
            {/*
              The overlay lives on the decrypt span, not the anchor, so hovering
              anywhere on the card counts as hovering this span — that is what
              fires the animation. Clicks still bubble to the anchor.
            */}
            <DecryptedText
              text={title}
              animateOn="hover"
              sequential={false}
              revealDirection="center"
              speed={80}
              maxIterations={12}
              useOriginalCharsOnly
              // The underline lives here, not on the anchor: this span is
              // `inline-block`, and text-decoration does not propagate into an
              // atomic inline box from an ancestor.
              parentClassName="after:absolute after:inset-0 after:content-[''] group-hover/card:underline"
            />
          </a>
        </CardTitle>
        <CardDescription className="text-neutral-400 transition-colors group-hover/card:text-neutral-700">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
