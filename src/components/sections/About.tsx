import Image from "next/image";
import { parseHighlights, photoUrl } from "@/lib/content/helpers";
import type { SiteContent } from "@/lib/content/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  title: string;
  about: SiteContent["about"];
  profile: SiteContent["profile"];
};

export function About({ title, about, profile }: Props) {
  return (
    <section id="about" aria-labelledby="about-title" className="reveal">
      <SectionHeading id="about-title" index="01" title={title} fig="Fig. 01 · Profile" />
      {/* Photo floats right so the text wraps underneath it instead of leaving a gap. */}
      <div className="flow-root leading-relaxed text-muted">
        <figure className="mx-auto mb-8 w-56 sm:float-right sm:mb-4 sm:ml-8 sm:w-52">
          <div className="bp-frame p-2">
            <Image
              src={photoUrl(profile)}
              alt={profile.photo.alt}
              width={416}
              height={416}
              sizes="(min-width: 640px) 208px, 224px"
              className="aspect-square w-full object-cover grayscale-[35%] transition duration-300 hover:grayscale-0"
            />
          </div>
          <figcaption className="label mt-3 text-center">Fig. 01a — The engineer</figcaption>
        </figure>

        {about.paragraphs.map((para, i) => (
          <p key={i} className="mb-4">
            {parseHighlights(para).map((seg, j) =>
              seg.highlight ? (
                <span key={j} className="text-ink">
                  {seg.text}
                </span>
              ) : (
                seg.text
              ),
            )}
          </p>
        ))}
        {about.recentTech.length > 0 && (
          <>
            <p className="mb-4 pt-2 text-sm text-ink">{about.recentTitle}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm sm:grid-cols-3">
              {about.recentTech.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-accent">▹</span>
                  {t}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
