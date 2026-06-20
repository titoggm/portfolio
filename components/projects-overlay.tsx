"use client";

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import Image from "next/image";
import { motion } from "motion/react";
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
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
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
            <Reveal className="space-y-1">
              <h1 className="text-white text-xl">Augmenting myself and my teammates through agentic Content Management System (CMS) workflows</h1>
              <Image
                src="/contentful/pai-ready-contentful.png"
                alt="Rondo agent ready for Contentful tasks"
                width={1874}
                height={374}
                sizes={IMAGE_SIZES}
                className="w-full h-auto mt-4"
              />
              <p className="text-neutral-300 text-xs mt-1 text-center">Rondo PAI ready to do some Contentful work</p>
            </Reveal>

            {/* The Problem */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">The Problem</h2>
              <p className="text-neutral-300">
                I noticed our team was spending a significant amount of time on repetitive,
                manual work inside our Contentful CMS space. This pulled attention away from
                higher-impact design work, such as:
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
                means designers have to manually create and manage pages with anywhere from 50
                to 200 CMS entries per page. Every entry needs to follow specific naming
                conventions and tagging standards to keep everything organized and maintainable.
              </p>
              <p className="text-neutral-300">
                When you&apos;re operating at that scale, it quickly turns into a lot of repetitive
                work that doesn&apos;t necessarily require a designer&apos;s expertise.
              </p>
              <p className="text-neutral-300">
                Instead of looking for ways to optimize individual steps in the CMS workflow, I
                started asking a different question:
              </p>
              <p className="text-neutral-400 pl-4 border-l border-neutral-700">
                How can we give designers a better starting point?
              </p>
              <p className="text-neutral-300">
                Rather than building a system that expects humans to do all the setup work, what
                would a workflow look like if it was designed for collaboration between humans
                and AI?
              </p>
              <p className="text-neutral-300">
                Like a tandem bike. Two riders moving together.
              </p>
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
                An easy-to-use Contentful Agent Skill that can be installed by anyone on the team.
              </p>
              <p className="text-neutral-300">
                A simple <span className="text-white">/install-hil</span> command that has a primary
                agent walk the user through setup step-by-step, lowering friction and making
                adoption easy. Human in the loop install command.
              </p>
              <p className="text-neutral-300">
                This for me was the most important feature. Onboarding teammates as fast as
                possible. (Shoutout to IndyDevDan for his agentic engineering YouTube videos.)
              </p>
              <p className="text-neutral-300">
                This Contentful Agent Skill is a part of a Personalized AI Infrastructure I&apos;ve
                been working on. If you&apos;re interested, I highly recommend checking out Daniel
                Miessler&apos;s work.
              </p>

              <h3 className="text-neutral-300 pt-2">Some of the workflows in the Contentful Agent Skill</h3>

              <div className="space-y-5">
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

            {/* What's Next */}
            <Reveal className="space-y-4">
              <h2 className="text-white text-base">What&apos;s Next</h2>
              <p className="text-neutral-300">
                As designers continue using the Contentful Skill, we&apos;re expanding the system
                with additional workflows.
              </p>
              <p className="text-neutral-300">
                One example currently in progress is a color-selection workflow, where agents
                help choose appropriate colors based on the entry&apos;s purpose and context. This
                gives designers an even stronger starting point and reduces repetitive
                decision-making inside the CMS.
              </p>
              <p className="text-neutral-300">
                Over time, the goal is to continue removing operational friction so designers
                can focus more on creative and strategic work, and less on the repetitive tasks.
              </p>
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
            <Reveal className="space-y-1">
              <h1 className="text-white text-xl">Nave Bank Card Design</h1>
            </Reveal>

            {/* Final Designs */}
            <Reveal className="space-y-4">

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
