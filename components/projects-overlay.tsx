"use client";

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DecryptedText from "./decrypted-text";

const IMAGE_SIZES = "(max-width: 672px) 100vw, 672px";

function Reveal({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  return <section className={className}>{children}</section>;
}

interface ProjectSection {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface Project {
  id: string;
  name: string;
  company: string;
  year: string;
  image?: string;
  meta?: Array<[string, string]>;
  sections: ProjectSection[];
}

const PROJECTS: Project[] = [
  {
    id: "contentful-skill",
    name: "Contentful CMS Agentic Workflows",
    company: "Red Ventures",
    year: "2025",
    sections: [
      {
        id: "case-study",
        label: "Case Study",
        content: (
          <div className="space-y-8 text-sm leading-relaxed max-w-2xl">
            {/* Title */}
            <Reveal className="space-y-1 pt-6">
              <h1 className="text-white text-xl">Augmenting my team with agentic Contentful workflows</h1>
            </Reveal>

            {/* The Problem */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">The Problem</h2>
              <p className="text-neutral-300">
                I noticed our team was spending a significant amount of time on repetitive,
                manual work inside our Contentful CMS space. In fact,{" "}
                <span className="text-white">
                  roughly 50% of our team&apos;s capacity was being consumed by these operational
                  tasks
                </span>
                , pulling attention away from higher-impact design work such as:
              </p>
              <ul className="space-y-1 pl-4">
                {[
                  "Creative strategy",
                  "User experience research",
                  "Designing high-performing page templates",
                ].map((item) => (
                  <li key={item} className="text-neutral-400 flex gap-2">
                    <span className="text-neutral-600 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-neutral-300">
                Our team moves fast and scales pages directly within Contentful. This often
                means designers have to manually create and manage pages containing anywhere
                from <span className="text-white">50 to 200 CMS entries per page</span>. Every
                entry must follow specific naming conventions and tagging standards to keep
                everything organized and maintainable.
              </p>
              <p className="text-neutral-300">
                At this scale, the work quickly becomes highly repetitive and operational in
                nature. Yet it consumes nearly half of the team&apos;s capacity despite not
                requiring a designer&apos;s expertise, limiting the time available for more
                strategic and impactful design work.
              </p>

              <h3 className="text-neutral-300 pt-2">Two approaches to design automation</h3>
              <p className="text-neutral-300">
                In my opinion, currently there are two approaches to design automation:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="text-neutral-400 flex gap-2">
                  <span className="text-neutral-600 shrink-0">—</span>
                  <span>
                    <span className="text-white">Task automation</span> focuses on speeding up
                    repetitive and time-consuming work—such as renaming layers, generating
                    content, or managing layouts—through tools and plugins that save designers
                    time.
                  </span>
                </li>
                <li className="text-neutral-400 flex gap-2">
                  <span className="text-neutral-600 shrink-0">—</span>
                  <span>
                    <span className="text-white">Creative AI automation</span> acts as a design
                    companion, using AI to generate ideas, suggest solutions, and even create new
                    screens based on an existing design system, helping designers explore
                    possibilities they might not have considered on their own.
                  </span>
                </li>
              </ul>

              <h3 className="text-neutral-300 pt-2">
                How can we give designers a better starting point within our CMS?
              </h3>
              <p className="text-neutral-300">
                The goal isn&apos;t to remove designers from the process. It&apos;s to reduce the amount
                of time they spend creating entries, filling out fields, and setting up content
                structures so they can spend more time doing what they&apos;re best at: designing,
                reviewing, and making creative decisions.
              </p>
              <p className="text-neutral-300">
                This is where agentic workflows become interesting. Agents can take care of the
                repetitive parts of CMS setup—creating entries, applying naming conventions,
                organizing content, and handling the work that scales poorly for humans.
              </p>
              <p className="text-neutral-300">
                The goal was simple:
              </p>
              <p className="text-neutral-400 pl-4 border-l border-neutral-700">
                Let agents handle the scaling and provide designers with a strong starting point
                inside Contentful. Designers can then review, refine, and finalize the page
                before it goes live.
              </p>
            </Reveal>

            {/* The Solution */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">The Solution</h2>
              <p className="text-neutral-300">
                An easy-to-use custom Contentful Agent Skill that anyone on the team could
                install and use, regardless of their level of technical familiarity.
              </p>

              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-white">/install-hil</p>
                  <p className="text-neutral-400">
                    A simple <span className="text-neutral-300">/install-hil</span> command that
                    guides the user through the setup process step by step, keeping a human in the
                    loop and making it easy for anyone on the team to get started.
                  </p>
                  <p className="text-neutral-400">
                    By reducing setup friction to a single command and guided onboarding flow,
                    teammates could start using the skill immediately without needing to
                    understand the underlying architecture. (Shoutout to IndyDevDan for his
                    Agentic Engineering YouTube videos.)
                  </p>
                  <p className="text-neutral-400">
                    The Contentful Agent Skill itself is part of a larger Personalized AI
                    Infrastructure I&apos;ve been building. I won&apos;t dive into that here, but if
                    you&apos;re interested in the broader philosophy behind it, I highly recommend
                    Daniel Miessler&apos;s work.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-white">
                    /replicate-entry{" "}
                    <span className="text-neutral-600 text-xs">(primary workflow)</span>
                  </p>
                  <p className="text-neutral-400">
                    Replicates existing Contentful entries. This can replicate an entire page, a
                    section, or a single entry while preserving structure and consistency. This
                    workflow uses a combination of sequential processing and parallelism. Focused
                    subagents that primary or background agents can use throughout the workflow.
                  </p>
                  <Image
                    src="/contentful/workflow-replicate-entry.png"
                    alt="replicate-entry workflow"
                    width={972}
                    height={114}
                    sizes={IMAGE_SIZES}
                    className="w-full h-auto mt-2"
                  />

                  <h4 className="text-neutral-300 pt-2">Tool usage strategy</h4>
                  <p className="text-neutral-400">
                    Getting our agent tool strategy right was critical. We intentionally avoided
                    relying exclusively on the Contentful MCP Server because it introduces
                    significant token overhead — and tokens translate directly to cost.
                  </p>
                  <p className="text-neutral-400">
                    For example, replicating a content model with 200 entries using only MCP tools
                    would require:
                  </p>
                  <ul className="space-y-1 pl-4">
                    {["200 get_entry tool calls", "200 create_entry tool calls"].map((item) => (
                      <li key={item} className="text-neutral-400 flex gap-2">
                        <span className="text-neutral-600 shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-neutral-400">
                    That&apos;s <span className="text-white">400 tool calls total</span>, with each
                    call adding context and consuming tokens.
                  </p>
                  <p className="text-neutral-400">
                    Instead, we adopted a hybrid approach:
                  </p>
                  <ol className="space-y-2 pl-4">
                    <li className="text-neutral-400 flex gap-2">
                      <span className="text-neutral-600 shrink-0">1.</span>
                      <span>
                        <span className="text-white">
                          Fetch an entry snapshot via the Contentful APIs.
                        </span>{" "}
                        The entire set of entries is retrieved as JSON in a small number of API
                        requests instead of hundreds of get_entry tool calls.
                      </span>
                    </li>
                    <li className="text-neutral-400 flex gap-2">
                      <span className="text-neutral-600 shrink-0">2.</span>
                      <span>
                        <span className="text-white">
                          Build a dependency-aware execution plan.
                        </span>{" "}
                        The snapshot is analyzed and broken into execution waves based on entry
                        references.
                      </span>
                    </li>
                    <li className="text-neutral-400 flex gap-2">
                      <span className="text-neutral-600 shrink-0">3.</span>
                      <span>
                        <span className="text-white">Execute waves from the bottom up.</span>{" "}
                        Entries with no dependencies are created first. Once those entries exist,
                        the next wave of entries that reference them can be created. This continues
                        until the final wave creates the top-level parent entries.
                      </span>
                    </li>
                    <li className="text-neutral-400 flex gap-2">
                      <span className="text-neutral-600 shrink-0">4.</span>
                      <span>
                        <span className="text-white">
                          Run entry creation subagents in parallel.
                        </span>{" "}
                        Within each wave, multiple subagents create entries concurrently using the
                        create_entry MCP tool.
                      </span>
                    </li>
                  </ol>

                  <h4 className="text-neutral-300 pt-2">Why the hybrid approach?</h4>
                  <p className="text-neutral-400">
                    APIs are better suited for retrieving large amounts of data, while MCP tools
                    are better suited for performing actions. Combining the two cuts tool usage by{" "}
                    <span className="text-white">50%</span> (400 → 200 for a 200-entry
                    replication) and supports parallel, dependency-aware execution.
                  </p>
                  <p className="text-neutral-400">
                    Fewer tool calls means fewer tokens, and fewer tokens means lower cost.{" "}
                    <span className="text-white">
                      Replicating a page with 100 entries runs roughly $0.22 on Claude Sonnet 4.6.
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-white">/update-context</p>
                  <p className="text-neutral-400">
                    Keeps Contentful context files in sync with our CMS space through a scheduled
                    cron job. These files are saved locally as structured markdown documents that
                    our agents use as lightweight context sources. For example, all available tags
                    within our CMS space are stored in <span className="text-neutral-300">tags.md</span>,
                    making them directly accessible to agents without repeatedly consuming tokens
                    to fetch the same context. Since <span className="text-neutral-300">tags.md</span> contains
                    around 500 tags, we also built focused Bun + TypeScript utility scripts that
                    allow agents to validate or search for specific tags programmatically instead
                    of reading the entire markdown file.
                  </p>
                  <Image
                    src="/contentful/workflow-update-context.png"
                    alt="update-context workflow"
                    width={1340}
                    height={554}
                    sizes={IMAGE_SIZES}
                    className="w-full h-auto mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-white">/create-tag</p>
                  <p className="text-neutral-400">
                    Creates new public or private tags if they do not already exist within our CMS
                    space. Before creating a tag, the agent checks the <span className="text-neutral-300">tags.md</span> Contentful
                    context file to validate whether the tag already exists, helping prevent
                    duplicates and extra tool calls.
                  </p>
                  <Image
                    src="/contentful/workflow-create-tag.png"
                    alt="create-tag workflow"
                    width={1592}
                    height={356}
                    sizes={IMAGE_SIZES}
                    className="w-full h-auto mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-white">/name-entry</p>
                  <p className="text-neutral-400">
                    Guides teammates or agents through proper naming conventions for CMS entries,
                    ensuring consistency across the system.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-white">/tag-entry</p>
                  <p className="text-neutral-400">
                    Guides teammates or agents through proper tagging standards for CMS entries,
                    ensuring consistency across the system.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        ),
      },
    ],
  },
  {
    id: "nave-bank-card",
    name: "Nave Bank Card Design",
    company: "Nave Bank",
    year: "2025",
    sections: [
      {
        id: "case-study",
        label: "Case Study",
        content: (
          <div className="space-y-8 text-sm leading-relaxed max-w-2xl">
            <Reveal className="space-y-1 pt-6">
              <h1 className="text-white text-xl">Nave Bank Card Design</h1>
            </Reveal>

            {/* Physical Prototype */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">Physical Prototype</h2>
              <div className="space-y-2">
                <p className="text-neutral-400 text-xs">
                  Charcoal — Plastic material · the card we shipped
                </p>
                <Image
                  src="/nave-bank/credit-card-live.jpg"
                  alt="Nave Bank card — physical Charcoal plastic prototype held in hand"
                  width={3000}
                  height={2249}
                  sizes={IMAGE_SIZES}
                  className="w-full h-auto"
                />
              </div>
            </Reveal>

            {/* Final Designs */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">Final Designs</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-neutral-400 text-xs">Black Metal with Purpura</p>
                  <Image
                    src="/nave-bank/black-metal-purpura-new.jpg"
                    alt="Nave Bank card design — Black metal with Purpura"
                    width={1920}
                    height={1080}
                    sizes={IMAGE_SIZES}
                    className="w-full h-auto"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-neutral-400 text-xs">Purpura — Plastic material</p>
                  <Image
                    src="/nave-bank/card-purpura-plastic.jpg"
                    alt="Nave Bank card design — Purpura plastic"
                    width={1920}
                    height={1080}
                    sizes={IMAGE_SIZES}
                    className="w-full h-auto"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-neutral-400 text-xs">Charcoal — Plastic material</p>
                  <Image
                    src="/nave-bank/card-charcoal-plastic.jpg"
                    alt="Nave Bank card design — Charcoal plastic"
                    width={1920}
                    height={1080}
                    sizes={IMAGE_SIZES}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </Reveal>

            {/* Market Research */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">Market Research</h2>
              <p className="text-neutral-300">
                Looked at local banks in Puerto Rico, larger US banks, and a few Neobanks.
              </p>
              <div className="space-y-3">
                <Image
                  src="/nave-bank/research-competitors-1.jpg"
                  alt="Neobank competitors research"
                  width={1920}
                  height={1080}
                  sizes={IMAGE_SIZES}
                  className="w-full h-auto"
                />
                <Image
                  src="/nave-bank/research-competitors-2.jpg"
                  alt="Neobank competitors research continued"
                  width={1920}
                  height={1080}
                  sizes={IMAGE_SIZES}
                  className="w-full h-auto"
                />
              </div>
            </Reveal>

            {/* Inspo / Sketches */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">Inspo / Sketches</h2>
              <p className="text-neutral-300">
                Started by looking at spaces where light does all the talking. The work of artists
                like Dan Flavin and James Turrell mainly. Dark corridors, glowing installations,
                surfaces that feel intentional.
              </p>
              <p className="text-neutral-300">
                That led to thinking about ships and vessels — the lines found on spacecraft doors.
                Forms that are functional but carry a quiet sense of purpose.
              </p>
              <Image
                src="/nave-bank/inspo-sketches.jpg"
                alt="Inspiration sketches"
                width={1920}
                height={1080}
                sizes={IMAGE_SIZES}
                className="w-full h-auto"
              />
            </Reveal>

            {/* Ideation */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">Ideation</h2>
              <p className="text-neutral-300">
                When ideating I like to start with a blank page and let myself go. Not worrying
                about perfection, just getting as many ideas down as possible. Should be a mess.
              </p>
              <Image
                src="/nave-bank/ideation.png"
                alt="Ideation sketches"
                width={1896}
                height={1380}
                sizes={IMAGE_SIZES}
                className="w-full h-auto"
              />
            </Reveal>

            {/* Thank You */}
            <Reveal>
              <Image
                src="/nave-bank/thank-you.jpg"
                alt="Thank you — Nave Bank Design Intern"
                width={1920}
                height={1080}
                sizes={IMAGE_SIZES}
                className="w-full h-auto"
              />
            </Reveal>
          </div>
        ),
      },
    ],
  },
];

export interface ProjectsOverlayHandle {
  nextProject: () => void;
  prevProject: () => void;
}

interface ProjectsOverlayProps {
  onClose: () => void;
}

export const ProjectsOverlay = forwardRef<
  ProjectsOverlayHandle,
  ProjectsOverlayProps
>(({ onClose }, ref) => {
    const [projectIndex, setProjectIndex] = useState(0);

    const nextProject = useCallback(() => {
      setProjectIndex((i) => Math.min(i + 1, PROJECTS.length - 1));
    }, []);

    const prevProject = useCallback(() => {
      setProjectIndex((i) => Math.max(i - 1, 0));
    }, []);

    useImperativeHandle(
      ref,
      () => ({ nextProject, prevProject }),
      [nextProject, prevProject]
    );

    const project = PROJECTS[projectIndex];
    const section = project.sections[0];

    return (
      <div className="absolute inset-0 bg-neutral-950 font-mono flex text-sm z-10">

        {/* Main column */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Project selector */}
          <div className="flex items-center border-b border-neutral-700 shrink-0 text-sm">
            <div className="flex flex-1 overflow-x-auto">
              {PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProjectIndex(i)}
                  className={`px-4 py-1 whitespace-nowrap cursor-pointer ${
                    i === projectIndex ? "bg-white text-black" : "text-neutral-500"
                  }`}
                >
                  {i === projectIndex ? (
                    <span className="inline-block bg-white">
                      <DecryptedText
                        key={projectIndex}
                        animateOn="view"
                        sequential={false}
                        revealDirection="center"
                        text={p.name}
                        speed={80}
                        maxIterations={6}
                        useOriginalCharsOnly
                        className="text-black underline"
                        encryptedClassName="text-black"
                      />
                    </span>
                  ) : (
                    p.name
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close projects"
              className="px-4 py-1 text-neutral-500 hover:text-white cursor-pointer shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content area */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-4 sm:px-6 py-6 flex justify-center">{section.content}</div>
          </ScrollArea>

          {/* Bottom hint bar */}
          <div className="border-t border-neutral-700 pl-4 pr-2 py-1 text-neutral-500 shrink-0 flex items-center justify-between">
            <span className="hidden sm:inline">← → to switch projects · esc to close</span>
            <span className="sm:hidden">tap a project to switch</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevProject}
                disabled={projectIndex === 0}
                aria-label="Previous project"
                className="p-1 disabled:opacity-30 enabled:hover:text-white enabled:cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextProject}
                disabled={projectIndex === PROJECTS.length - 1}
                aria-label="Next project"
                className="p-1 disabled:opacity-30 enabled:hover:text-white enabled:cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ProjectsOverlay.displayName = "ProjectsOverlay";
