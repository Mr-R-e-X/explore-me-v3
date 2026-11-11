import { absoluteUrl, photoUrl, siteUrl } from "@/lib/content/helpers";
import type { SiteContent } from "@/lib/content/schema";

export function JsonLd({ content }: { content: SiteContent }) {
  const { profile, experience, skills, seo } = content;
  const current = experience[0];
  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    url: siteUrl,
    image: absoluteUrl(photoUrl(profile)),
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: seo.description,
    ...(current && {
      worksFor: { "@type": "Organization", name: current.company, ...(current.url && { url: current.url }) },
    }),
    ...(profile.education.school && {
      alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
    }),
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    knowsAbout: skills.flatMap((g) => g.items),
    sameAs: Object.values(profile.social).filter(Boolean),
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: seo.title,
        mainEntity: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
