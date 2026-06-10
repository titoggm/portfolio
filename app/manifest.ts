import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "tito.dev — Tito Garcia, Product Designer",
    short_name: "tito.dev",
    description:
      "Tito Garcia — an interdisciplinary product designer working across design, AI, and engineering.",
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
