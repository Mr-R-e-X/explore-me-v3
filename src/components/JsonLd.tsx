import { experience } from "@/content/experience";
import { profile, siteUrl } from "@/content/profile";
import { skillGroups } from "@/content/skills";

export function JsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    url: siteUrl,
    image: `${siteUrl}${profile.photo}`,
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: profile.description,
    worksFor: { "@type": "Organization", name: experience[0].company, url: experience[0].url },
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      addressCountry: "IN",
    },
    knowsAbout: skillGroups.flatMap((g) => g.items),
    sameAs: Object.values(profile.social),
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: `${profile.name} — ${profile.role}`,
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
