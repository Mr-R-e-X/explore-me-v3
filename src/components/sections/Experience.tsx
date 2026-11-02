import { ArrowUpRight } from "lucide-react";
import type { Job } from "@/lib/content/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tags } from "@/components/ui/Tags";
import { ExperienceTabs } from "./ExperienceTabs";

export function Experience({ title, jobs }: { title: string; jobs: Job[] }) {
  const panels = jobs.map((job) => (
    <article key={job.id}>
      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
        {job.role}{" "}
        <span className="text-accent-ink">
          @{" "}
          {job.url ? (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {job.company}
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            job.company
          )}
        </span>
      </h3>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
        {job.period}
        {job.note && <span className="block normal-case tracking-normal sm:inline sm:before:content-['_·_']">{job.note}</span>}
      </p>
      <ul className="mt-5 space-y-3">
        {job.points.map((p) => (
          <li key={p} className="relative pl-6 leading-relaxed text-muted">
            <span aria-hidden="true" className="absolute left-0 top-0 text-accent">▹</span>
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Tags items={job.stack} label={`Technologies used at ${job.company}`} />
      </div>
    </article>
  ));

  return (
    <section id="experience" aria-labelledby="experience-title" className="reveal">
      <SectionHeading id="experience-title" index="02" title={title} fig="Fig. 02 · Timeline" />
      <ExperienceTabs
        tabs={jobs.map((j) => ({ id: j.id, label: j.company }))}
        panels={panels}
      />
    </section>
  );
}
