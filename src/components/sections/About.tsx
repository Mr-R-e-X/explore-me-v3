import Image from "next/image";
import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";

const recent = ["TypeScript", "NestJS", "Hono", "Next.js", "PostgreSQL", "Redis", "Docker", "Pi"];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="reveal">
      <SectionHeading id="about-title" index="01" title="About" fig="Fig. 01 · Profile" />
      <div className="grid gap-10 sm:grid-cols-[1fr_auto]">
        <div className="space-y-4 leading-relaxed text-muted">
          <p>
            Hi, I&apos;m Souvik — a software engineer who likes owning a feature from the
            whiteboard to the pager. I started out teaching full-stack development at{" "}
            <span className="text-ink">Coding Ninjas</span>, where explaining other people&apos;s bugs
            turned out to be the best way to learn systems deeply.
          </p>
          <p>
            Since then I&apos;ve built payment rails processing tens of thousands of transactions a
            month at <span className="text-ink">Edviron</span>, government-scale citizen workflows at{" "}
            <span className="text-ink">Prodios Labs</span>, and a production e-commerce platform as a
            freelancer — schema, APIs, security, deployment and observability included.
          </p>
          <p>
            These days I&apos;m most excited about LLM applications that actually ship: retrieval,
            tool-calling agents, and the boring infrastructure that makes them reliable.
          </p>
          <p className="pt-2 text-sm text-ink">A few technologies I&apos;ve been working with lately:</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm">
            {recent.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-accent">▹</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <figure className="mx-auto w-56 sm:w-52">
          <div className="bp-frame p-2">
            <Image
              src={profile.photo}
              alt="Portrait of Souvik Hazra"
              width={416}
              height={416}
              sizes="(min-width: 640px) 208px, 224px"
              className="aspect-square w-full object-cover grayscale-[35%] transition duration-300 hover:grayscale-0"
            />
          </div>
          <figcaption className="label mt-3 text-center">Fig. 01a — The engineer</figcaption>
        </figure>
      </div>
    </section>
  );
}
