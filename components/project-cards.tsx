import { ProjectCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";

export function ProjectCards() {
  return (
    <div
      data-testid="project-grid"
      className="py-2 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      {PROJECTS.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
