import type { SkillGroup } from "@/lib/content/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills({ title, groups }: { title: string; groups: SkillGroup[] }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="reveal">
      <SectionHeading id="skills-title" index="04" title={title} fig="Fig. 04 · Stack" />
      <div className="bp-frame grid sm:grid-cols-2">
        {groups.map((g, i) => (
          <div
            key={g.id}
            className={`p-5 sm:p-6 ${i > 0 ? "border-t border-line" : ""} ${
              i === 1 ? "sm:border-t-0" : ""
            } ${i % 2 === 1 ? "sm:border-l" : ""}`}
          >
            <h3 className="label flex items-center justify-between">
              <span>{g.label}</span>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {g.items.map((s) => (
                <li key={s} className="text-[15px]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
