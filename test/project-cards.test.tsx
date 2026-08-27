import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ProjectCards } from "@/components/project-cards";
import { PROJECTS } from "@/lib/projects";

describe("ProjectCards", () => {
  test("renders one link per project", () => {
    render(<ProjectCards />);
    expect(screen.getAllByRole("link")).toHaveLength(PROJECTS.length);
  });

  test("renders every project title", () => {
    render(<ProjectCards />);
    for (const project of PROJECTS) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  test("lays out three cards per row on desktop", () => {
    const { container } = render(<ProjectCards />);
    // The three-up layout is a spec, and nothing else in the DOM encodes it.
    const grid = container.querySelector("[data-testid='project-grid']");
    expect(grid?.className).toContain("lg:grid-cols-3");
  });
});
