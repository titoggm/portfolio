import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";

const project: Project = {
  id: "test-project",
  title: "Test Project",
  description: "A short description of the test project.",
  image: "/projects/test-cover.png",
  imageAlt: "Test Project cover",
  href: "https://example.com/test",
};

describe("ProjectCard", () => {
  test("renders the title and description", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(
      screen.getByText("A short description of the test project.")
    ).toBeInTheDocument();
  });

  test("renders the image with its alt text", () => {
    render(<ProjectCard project={project} />);
    const img = screen.getByAltText("Test Project cover");
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe("/projects/test-cover.png");
  });

  test("links to the project and opens in a new tab safely", () => {
    render(<ProjectCard project={project} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("https://example.com/test");
    expect(link.getAttribute("target")).toBe("_blank");
    const rel = link.getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  test("the link has an accessible name (the icon alone is not)", () => {
    render(<ProjectCard project={project} />);
    const link = screen.getByRole("link", { name: /test project/i });
    expect(link).toBeInTheDocument();
  });

  test("plays a looping, muted video in place of the image when one is set", () => {
    const { container } = render(
      <ProjectCard project={{ ...project, video: "/projects/demo.mp4" }} />
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video?.getAttribute("src")).toBe("/projects/demo.mp4");
    expect(video?.hasAttribute("loop")).toBe(true);
    expect(video?.hasAttribute("autoplay")).toBe(true);
    // Browsers only autoplay muted video.
    expect((video as HTMLVideoElement).muted).toBe(true);
    expect(video?.getAttribute("playsinline")).not.toBeNull();
    // The image is the poster frame, not a second element.
    expect(container.querySelector("img")).toBeNull();
    expect(video?.getAttribute("poster")).toBe("/projects/test-cover.png");
    expect(video?.getAttribute("aria-label")).toBe("Test Project cover");
  });


  test("the whole card is clickable through a single stretched link", () => {
    const { container } = render(<ProjectCard project={project} />);
    // One link only: the overlay is a pseudo-element, not a second anchor.
    expect(screen.getAllByRole("link")).toHaveLength(1);
    const link = screen.getByRole("link");
    // The overlay sits on the decrypt span inside the link, so hovering the card
    // both fires the animation and lands clicks on the anchor.
    const overlay = link.querySelector("[class*='after:inset-0']");
    expect(overlay).not.toBeNull();
    expect(overlay?.className).toContain("after:absolute");
    // The card is the positioning context the overlay stretches against.
    const card = container.querySelector("[data-slot='card']");
    expect(card?.className).toContain("relative");
  });
});
