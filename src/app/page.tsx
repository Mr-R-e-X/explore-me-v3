import { CursorTrail } from "@/components/CursorTrail";
import { GridFlow } from "@/components/GridFlow";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { PreviewBar } from "@/components/layout/PreviewBar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Intro } from "@/components/sections/Intro";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { getContent } from "@/lib/content/get-content";
import { resumeUrl } from "@/lib/content/helpers";

export const ensureStatic = "navigation";

export default async function Home() {
  const { content: c, isDraft, years } = await getContent();

  return (
    <>
      {c.theme.gridFlowEnabled && <GridFlow color={c.theme.gridFlowColor} />}
      {c.theme.trailEnabled && <CursorTrail color={c.theme.trailColor} />}
      <div data-content-root className="relative z-10">
        <JsonLd content={c} />
        {isDraft && <PreviewBar />}
        <MobileHeader name={c.profile.name} resumeHref={resumeUrl(c.profile)} />
        <div id="top" className="mx-auto max-w-3xl px-4 sm:px-6 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-10">
          <Intro profile={c.profile} years={years} current={c.experience[0]} />
          <main id="content" tabIndex={-1} className="space-y-28 pb-8 pt-16 outline-none lg:py-20">
            <About title={c.sections.about} about={c.about} profile={c.profile} />
            <Experience title={c.sections.experience} jobs={c.experience} />
            <Projects sections={c.sections} projects={c.projects} workProjects={c.workProjects} />
            <Skills title={c.sections.skills} groups={c.skills} />
            <Contact contact={c.contact} profile={c.profile} />
            <Footer text={c.footer.text} />
          </main>
        </div>
      </div>
    </>
  );
}
