import { describe, expect, test } from "bun:test";
import { PROJECTS } from "@/lib/projects";

describe("PROJECTS data", () => {
  test("is non-empty", () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });

  test("every project has the fields a card needs", () => {
    for (const project of PROJECTS) {
      expect(project.id.length).toBeGreaterThan(0);
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.description.length).toBeGreaterThan(0);
      // A card shows a video or an image, so it needs at least one of them.
      expect((project.video ?? project.image ?? "").length).toBeGreaterThan(0);
      expect(project.imageAlt.length).toBeGreaterThan(0);
      expect(project.href.length).toBeGreaterThan(0);
    }
  });

  test("ids are unique", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every href is an https URL", () => {
    for (const project of PROJECTS) {
      expect(new URL(project.href).protocol).toBe("https:");
    }
  });

  test("every media path is root-relative", () => {
    for (const project of PROJECTS) {
      for (const path of [project.image, project.video].filter(Boolean)) {
        expect(path!.startsWith("/")).toBe(true);
      }
    }
  });

  test("includes the Contentful CMS Agentic Layer project", () => {
    const titles = PROJECTS.map((p) => p.title);
    expect(titles).toContain("Contentful CMS Agentic Layer");
  });

  test("every media path exists on disk", async () => {
    for (const project of PROJECTS) {
      for (const path of [project.image, project.video].filter(Boolean)) {
        const exists = await Bun.file(`${process.cwd()}/public${path}`).exists();
        expect(exists).toBe(true);
      }
    }
  });
});
