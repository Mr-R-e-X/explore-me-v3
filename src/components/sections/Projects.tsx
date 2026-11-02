import { Award, ArrowUpRight } from "lucide-react";
import type { Project, SiteContent, WorkProject } from "@/lib/content/schema";
import { AgentsFigure, PcFigure } from "@/components/ui/Figures";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tags } from "@/components/ui/Tags";

const figures = { agents: AgentsFigure, pc: PcFigure, none: null };

type Props = {
  sections: SiteContent["sections"];
  projects: Project[];
  workProjects: WorkProject[];
};

export function Projects({ sections, projects, workProjects }: Props) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="reveal">
      <SectionHeading id="projects-title" index="03" title={sections.projects} fig="Fig. 03 · Selected work" />
      <div className="space-y-8">
        {projects.map((p, i) => {
          const Figure = figures[p.figure];
          return (
            <article key={p.id} className="bp-frame flex flex-col">
              {Figure && (
                <div className="relative flex h-60 items-center justify-center border-b border-dashed border-line px-5 pb-5 pt-10 sm:h-72">
                  <p className="label absolute left-5 top-4 sm:left-7">
                    Fig. 03{String.fromCharCode(97 + i)} — {p.title}
                  </p>
                  <Figure className="h-full w-auto max-w-full" />
                </div>
              )}
              <div className="p-5 sm:p-7">
                <p className="label">
                  Project 0{i + 1} · {p.kicker}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{p.title}</h3>
                {p.badge && (
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 font-mono text-xs text-accent-ink">
                    <Award className="size-3.5" aria-hidden="true" />
                    {p.badge}
                  </p>
                )}
                <p className="mt-4 leading-relaxed text-muted">{p.summary}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.points.map((pt) => (
                    <li key={pt} className="relative pl-6 leading-relaxed text-muted">
                      <span aria-hidden="true" className="absolute left-0 text-accent">▹</span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Tags items={p.stack} label={`${p.title} tech stack`} />
                </div>
                {p.links && p.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-4">
                    {p.links.map((l) => (
                      <a
                        key={l.id}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1 font-mono text-sm text-accent-ink underline-offset-4 hover:underline"
                      >
                        {l.label}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {workProjects.length > 0 && (
        <>
          <h3 className="label mt-16 flex items-center gap-3">
            <span>{sections.workProjects}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {workProjects.map((w) => (
              <li key={w.id} className="bp-frame flex flex-col p-5">
                <p className="label">{w.kicker}</p>
                <h4 className="mt-2 text-lg font-semibold tracking-tight">
                  {w.href ? (
                    <a
                      href={w.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-accent-ink"
                    >
                      {w.title}
                      <ArrowUpRight className="size-4 text-accent-ink" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    w.title
                  )}
                </h4>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{w.summary}</p>
                <ul aria-label={`${w.title} tech`} className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
                  {w.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
