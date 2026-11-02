"use client";

import type { ReactNode } from "react";
import type { Job, Project, SkillGroup, WorkProject } from "@/lib/content/schema";
import { newId } from "./editor-context";
import { ColorField, ObjectList, SelectField, StringList, TextArea, TextField, ToggleField } from "./fields";

export function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </header>
      {children}
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function ProfilePanel() {
  return (
    <Panel title="Profile" description="The intro column, header and contact details.">
      <Grid>
        <TextField path={["profile", "name"]} label="Full name" />
        <TextField path={["profile", "shortName"]} label="Short name" />
        <TextField path={["profile", "role"]} label="Role" />
        <TextField path={["profile", "headline"]} label="Headline" hint="Shown in accent colour after the role." />
      </Grid>
      <TextArea path={["profile", "pitch"]} label="Pitch" rows={3} />
      <Grid>
        <TextField path={["profile", "location"]} label="Location" />
        <TextField
          path={["profile", "careerStart"]}
          label="Career start"
          type="date"
          hint="Drives the “years of experience” number."
        />
        <TextField path={["profile", "email"]} label="Email" type="email" />
      </Grid>
      <h3 className="label pt-2">Social links</h3>
      <Grid>
        <TextField path={["profile", "social", "github"]} label="GitHub URL" />
        <TextField path={["profile", "social", "linkedin"]} label="LinkedIn URL" />
        <TextField path={["profile", "social", "x"]} label="X / Twitter URL" />
      </Grid>
      <h3 className="label pt-2">Education</h3>
      <Grid>
        <TextField path={["profile", "education", "degree"]} label="Degree" />
        <TextField path={["profile", "education", "school"]} label="School" />
        <TextField path={["profile", "education", "year"]} label="Year" />
      </Grid>
    </Panel>
  );
}

export function AboutPanel() {
  return (
    <Panel title="About" description="Wrap words in **double asterisks** to highlight them.">
      <StringList path={["about", "paragraphs"]} label="Paragraph" multiline addLabel="Add paragraph" />
      <TextField path={["about", "recentTitle"]} label="Technologies heading" />
      <StringList path={["about", "recentTech"]} label="Technology" addLabel="Add technology" />
    </Panel>
  );
}

export function ExperiencePanel() {
  return (
    <Panel title="Experience" description="Drag to reorder. The first entry is shown as your current role.">
      <ObjectList<Job>
        path={["experience"]}
        label="Job"
        addLabel="Add job"
        itemTitle={(j) => [j.company, j.role].filter(Boolean).join(" — ")}
        create={() => ({
          id: newId("job"),
          company: "",
          url: "",
          role: "",
          period: "",
          note: "",
          points: [],
          stack: [],
        })}
      >
        {(i) => (
          <>
            <Grid>
              <TextField path={["experience", i, "company"]} label="Company" />
              <TextField path={["experience", i, "url"]} label="Company URL" />
              <TextField path={["experience", i, "role"]} label="Role" />
              <TextField path={["experience", i, "period"]} label="Period" placeholder="May 2025 — Present" />
            </Grid>
            <TextField path={["experience", i, "note"]} label="Note (optional)" />
            <StringList path={["experience", i, "points"]} label="Point" multiline addLabel="Add point" />
            <StringList path={["experience", i, "stack"]} label="Tech" addLabel="Add tech" />
          </>
        )}
      </ObjectList>
    </Panel>
  );
}

const figureOptions = [
  { value: "agents", label: "Agent network (ChatForge)" },
  { value: "pc", label: "PC build blueprint" },
  { value: "none", label: "No figure" },
] as const;

export function ProjectsPanel() {
  return (
    <Panel title="Projects" description="Featured cards under “Things I’ve built”.">
      <ObjectList<Project>
        path={["projects"]}
        label="Project"
        addLabel="Add project"
        itemTitle={(p) => p.title}
        create={() => ({
          id: newId("project"),
          title: "",
          kicker: "",
          badge: "",
          summary: "",
          points: [],
          stack: [],
          figure: "none",
          links: [],
        })}
      >
        {(i) => (
          <>
            <Grid>
              <TextField path={["projects", i, "title"]} label="Title" />
              <TextField path={["projects", i, "kicker"]} label="Kicker" />
              <TextField path={["projects", i, "badge"]} label="Badge (optional)" />
              <SelectField path={["projects", i, "figure"]} label="Figure" options={figureOptions} />
            </Grid>
            <TextArea path={["projects", i, "summary"]} label="Summary" rows={3} />
            <StringList path={["projects", i, "points"]} label="Point" multiline addLabel="Add point" />
            <StringList path={["projects", i, "stack"]} label="Tech" addLabel="Add tech" />
            <ObjectList<{ id: string; label: string; href: string }>
              path={["projects", i, "links"]}
              label="Link"
              addLabel="Add link"
              itemTitle={(l) => l.label}
              create={() => ({ id: newId("link"), label: "", href: "" })}
            >
              {(j) => (
                <Grid>
                  <TextField path={["projects", i, "links", j, "label"]} label="Label" />
                  <TextField path={["projects", i, "links", j, "href"]} label="URL" />
                </Grid>
              )}
            </ObjectList>
          </>
        )}
      </ObjectList>
    </Panel>
  );
}

export function WorkPanel() {
  return (
    <Panel title="Production work" description="Smaller cards below the featured projects — add, edit, reorder or remove them here.">
      <TextField path={["sections", "workProjects"]} label="Group heading" />
      <ObjectList<WorkProject>
        path={["workProjects"]}
        label="Work project"
        addLabel="Add work project"
        itemTitle={(w) => w.title}
        create={() => ({ id: newId("work"), title: "", kicker: "", summary: "", stack: [], href: "" })}
      >
        {(i) => (
          <>
            <Grid>
              <TextField path={["workProjects", i, "title"]} label="Title" />
              <TextField path={["workProjects", i, "kicker"]} label="Kicker" />
              <TextField path={["workProjects", i, "href"]} label="Live URL (optional)" />
            </Grid>
            <TextArea path={["workProjects", i, "summary"]} label="Summary" rows={3} />
            <StringList path={["workProjects", i, "stack"]} label="Tech" addLabel="Add tech" />
          </>
        )}
      </ObjectList>
    </Panel>
  );
}

export function SkillsPanel() {
  return (
    <Panel title="Skills" description="Groups in the Toolbox section.">
      <ObjectList<SkillGroup>
        path={["skills"]}
        label="Group"
        addLabel="Add group"
        itemTitle={(g) => g.label}
        create={() => ({ id: newId("skills"), label: "", items: [] })}
      >
        {(i) => (
          <>
            <TextField path={["skills", i, "label"]} label="Group name" />
            <StringList path={["skills", i, "items"]} label="Skill" addLabel="Add skill" />
          </>
        )}
      </ObjectList>
    </Panel>
  );
}

export function SectionsPanel() {
  return (
    <Panel title="Sections, contact & footer">
      <h3 className="label">Section titles</h3>
      <Grid>
        <TextField path={["sections", "about"]} label="About" />
        <TextField path={["sections", "experience"]} label="Experience" />
        <TextField path={["sections", "projects"]} label="Projects" />
        <TextField path={["sections", "skills"]} label="Skills" />
      </Grid>
      <h3 className="label pt-2">Contact</h3>
      <Grid>
        <TextField path={["contact", "kicker"]} label="Kicker" />
        <TextField path={["contact", "title"]} label="Title" />
      </Grid>
      <TextArea path={["contact", "body"]} label="Body" rows={3} />
      <h3 className="label pt-2">Footer</h3>
      <TextField path={["footer", "text"]} label="Footer text" />
      <h3 className="label pt-2">Theme effects</h3>
      <Grid>
        <ToggleField
          path={["theme", "trailEnabled"]}
          label="Cursor trail"
          hint="Soft color dots that follow the pointer on desktop."
        />
        <ToggleField
          path={["theme", "gridFlowEnabled"]}
          label="Grid flow"
          hint="Color pulses that travel along the background grid lines."
        />
      </Grid>
      <ColorField
        path={["theme", "trailColor"]}
        label="Cursor trail color"
        hint="Desktop only. Pick a preset or a custom color, then publish."
      />
      <ColorField
        path={["theme", "gridFlowColor"]}
        label="Grid flow color"
        hint="Color of the pulses on the background grid."
      />
    </Panel>
  );
}

export function SeoPanel() {
  return (
    <Panel title="SEO" description="Used for the page title, search snippet and social cards.">
      <TextField path={["seo", "title"]} label="Page title" />
      <TextArea path={["seo", "description"]} label="Meta description" rows={3} hint="Aim for 150–160 characters." />
      <StringList path={["seo", "keywords"]} label="Keyword" addLabel="Add keyword" />
    </Panel>
  );
}
