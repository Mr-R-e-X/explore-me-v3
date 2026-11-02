import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Intro } from "@/components/sections/Intro";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export const ensureStatic = "navigation";

export default function Home() {
  return (
    <>
      <JsonLd />
      <MobileHeader />
      <div id="top" className="mx-auto max-w-3xl px-4 sm:px-6 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-10">
        <Intro />
        <main id="content" tabIndex={-1} className="space-y-28 pb-8 pt-16 outline-none lg:py-20">
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  );
}
