export type Project = {
  id: string;
  title: string;
  kicker: string;
  badge?: string;
  summary: string;
  points: string[];
  stack: string[];
  figure: "agents" | "pc";
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "chatforge",
    title: "ChatForge",
    kicker: "AI chatbot builder",
    badge: "1st Prize · Office Hackathon 2026",
    summary:
      "A multi-tenant platform for building AI agents with their own prompts, FAQs, documents, tools, and a branded chat widget you can drop into any site.",
    points: [
      "Streaming chat with agentic RAG on PostgreSQL + pgvector for document-grounded answers.",
      "Modular tool-calling layer on the Vercel AI SDK, so agents can take external actions.",
      "Embeddable widget via a tiny loader script and an isolated iframe.",
    ],
    stack: ["Next.js", "Vercel AI SDK", "PostgreSQL", "pgvector", "RAG"],
    figure: "agents",
    links: [{ label: "Try ChatForge", href: "https://chatforge.prodioslabs.in/" }],
  },
  {
    id: "futuristic-pc",
    title: "Futuristic PC",
    kicker: "E-commerce platform · freelance",
    summary:
      "A live e-commerce store for PC parts and custom builds that I built and run end to end: database, backend, storefront, admin panel, and production infrastructure.",
    points: [
      "Designed the schema and APIs for products, orders, payments, user accounts, and admin operations, with auth split into public and private routes.",
      "Storefront with category, brand and spec filters, plus the full checkout, payment and order lifecycle, with notifications for order and account updates.",
      "PC Builder with real-time compatibility checks and live price tracking across 500+ components.",
      "Admin panel for products, orders and store operations. Runs on Docker with Grafana/Loki monitoring and GitHub Actions CI/CD.",
    ],
    stack: ["Next.js", "Node.js", "MongoDB", "Docker", "Grafana", "GitHub Actions"],
    figure: "pc",
    links: [{ label: "Visit store", href: "https://futuristicpc.in" }],
  },
];

export type WorkProject = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  stack: string[];
  href?: string;
};

// Production work shipped at Prodios Labs.
export const workProjects: WorkProject[] = [
  {
    id: "ucc",
    title: "UCC Uttarakhand",
    kicker: "Government of Uttarakhand",
    summary:
      "The state's Uniform Civil Code portal for marriage, live-in and will registrations. I own citizen, officer and Super Admin workflows: Offline Forms with AES-GCM encryption, DigiLocker verification, and the clarification flow.",
    stack: ["TypeScript", "NestJS", "DigiLocker", "AES-GCM"],
    href: "https://ucc.uk.gov.in",
  },
  {
    id: "tealfeed",
    title: "Tealfeed",
    kicker: "SaaS · bookings & payments",
    summary:
      "A business management platform. I shipped booking cutoffs for personal and group events, automatic notifications for recurring-event extensions, and admin-side marking of offline payments.",
    stack: ["TypeScript", "Node.js"],
    href: "https://tealfeed.com",
  },
  {
    id: "mosje",
    title: "Mosje",
    kicker: "Internal analytics tool",
    summary:
      "An internal data analytics tool I built from scratch, covering API design, data aggregation, visualizations, and the Super Admin workflow.",
    stack: ["TypeScript", "Aggregations", "Dashboards"],
  },
];
