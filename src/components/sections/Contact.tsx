import { FileText, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { Socials } from "@/components/layout/Socials";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="reveal flex min-h-[60vh] flex-col justify-center">
      <div className="bp-frame px-6 py-20 text-center sm:px-12 sm:py-24">
        <p className="label">
          <span className="text-accent-ink">05.</span> What’s next?
        </p>
        <h2 id="contact-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Let’s build something.
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          I&apos;m open to full-time roles and interesting freelance work — backend, platform, or
          AI-heavy. My inbox is always open, whether it&apos;s an opportunity or just a hello.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            <Mail className="size-4" aria-hidden="true" />
            Say hello
          </a>
          <a
            href={profile.resume}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium transition-colors hover:border-accent hover:text-accent-ink"
          >
            <FileText className="size-4" aria-hidden="true" />
            Download resume
          </a>
        </div>
        <Socials className="mt-8 justify-center lg:hidden" />
      </div>
    </section>
  );
}
