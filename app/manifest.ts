import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "titogarcia.dev — Tito Garcia",
    short_name: "titogarcia.dev",
    description:
      "Tito Garcia — an AI-Native Product Designer working across design and engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
