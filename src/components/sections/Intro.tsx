import { ArrowDownRight, FileText, MapPin } from "lucide-react";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { ScrollSpyNav } from "@/components/layout/ScrollSpyNav";
import { Socials } from "@/components/layout/Socials";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// Evaluated at build time; the page is static, so this refreshes on each deploy.
const years = Math.floor(
  (Date.now() - new Date(profile.careerStart).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
);

export function Intro() {
  const current = experience[0];
  return (
    <div className="flex flex-col pt-14 no-scrollbar lg:sticky lg:top-0 lg:h-dvh lg:justify-between lg:overflow-y-auto lg:py-12">
      <div>
        <p className="label flex items-center gap-2">
          <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-accent" />
          Software Engineer
          <span aria-hidden="true">·</span>
          <MapPin className="size-3" aria-hidden="true" />
          {profile.location}
        </p>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mt-4 text-xl font-medium tracking-tight sm:text-2xl">
          {profile.role}.{" "}
          <span className="text-accent-ink">{profile.headline}</span>
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-muted">{profile.pitch}</p>

        <div className="bp-frame mt-6 flex max-w-md items-center gap-5 px-5 py-4">
          <p className="flex shrink-0 flex-col">
            <span className="font-mono text-3xl font-medium tracking-tight">{years}+</span>
            <span className="text-xs text-muted">years of experience</span>
          </p>
          <span aria-hidden="true" className="h-10 w-px bg-line" />
          <p className="text-sm leading-relaxed text-muted">
            Currently {current.role} at{" "}
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {current.company}
            </a>
            .
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#experience"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            View experience
            <ArrowDownRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href={profile.resume}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent-ink"
          >
            <FileText className="size-4" aria-hidden="true" />
            Resume (PDF)
          </a>
        </div>

        <ScrollSpyNav />
      </div>

      <div className="mt-8 hidden items-center gap-3 lg:flex">
        <Socials />
        <span aria-hidden="true" className="h-5 w-px bg-line" />
        <ThemeToggle />
      </div>
    </div>
  );
}
