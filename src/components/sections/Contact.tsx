import { FileText, Mail } from "lucide-react";
import { resumeUrl } from "@/lib/content/helpers";
import type { SiteContent } from "@/lib/content/schema";
import { Socials } from "@/components/layout/Socials";

type Props = { contact: SiteContent["contact"]; profile: SiteContent["profile"] };

export function Contact({ contact, profile }: Props) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="reveal flex min-h-[60vh] flex-col justify-center">
      <div className="bp-frame px-6 py-20 text-center sm:px-12 sm:py-24">
        <p className="label">
          <span className="text-accent-ink">05.</span> {contact.kicker}
        </p>
        <h2 id="contact-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {contact.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          {contact.body}
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
            href={resumeUrl(profile)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium transition-colors hover:border-accent hover:text-accent-ink"
          >
            <FileText className="size-4" aria-hidden="true" />
            Download resume
          </a>
        </div>
        <Socials profile={profile} className="mt-8 justify-center lg:hidden" />
      </div>
    </section>
  );
}
