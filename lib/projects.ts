export interface Project {
  /** Stable key; also used for the React list key. */
  id: string;
  /** Card heading. */
  title: string;
  /** Short body copy under the heading. */
  description: string;
  /**
   * Root-relative path to an image in `public/`. Optional when `video` is set,
   * where it serves as the poster frame.
   */
  image?: string;
  /** Alt text for whichever of `image` / `video` the card ends up showing. */
  imageAlt: string;
  /**
   * Root-relative path to a video in `public/`. When set, the card plays it on
   * loop in place of `image`.
   */
  video?: string;
  /** External URL opened in a new tab — Excalidraw, GitHub, a write-up, etc. */
  href: string;
}

export const PROJECTS: Project[] = [
  {
    id: "contentful-agentic-layer",
    title: "Contentful CMS Agentic Layer",
    description:
      "Agents that take actions inside the CMS the way you would. Repetitive Contentful scaling work moves off design and content teams, freeing those hours for higher-ROI work.",
    image: "/projects/contentful-agentic-layer-poster.jpg",
    video: "/projects/contentful-agentic-layer.mp4",
    imageAlt: "Contentful CMS Agentic Layer",
    href: "https://excalidraw.com/#json=thXviTgnycLDrLwyg4OR1,KPkwWNEvdtX9-OL2FBnTRQ",
  },
  {
    id: "nave-bank-card",
    title: "Nave Bank Card",
    description:
      "Design of Nave Bank's card, from competitor research and sketches through to the physical product in hand.",
    image: "/projects/nave-bank-card-image.webp",
    imageAlt: "Nave Bank Card",
    href: "https://www.figma.com/design/UcK68Z9EtlFz0INra2bI0v/Nave-Bank-Projects?node-id=0-1&t=7tXEcKhToRAwSBAz-1",
  },
];
