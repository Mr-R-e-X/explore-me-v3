import type { SiteContent } from "./schema";

// Seed content and fallback when MongoDB is empty or not configured.
export const defaultContent: SiteContent = {
  seo: {
    title: "Souvik Hazra — Software Engineer",
    description:
      "Souvik Hazra is a Software Engineer working with TypeScript, Node.js, NestJS, Next.js, PostgreSQL and MongoDB — building payment systems, SaaS platforms, and AI/LLM applications with RAG and agentic workflows.",
    keywords: [
      "Souvik Hazra",
      "Software Engineer",
      "Backend Developer",
      "Full Stack Developer",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "RAG",
      "AI Agents",
      "Portfolio",
    ],
  },
  profile: {
    name: "Souvik Hazra",
    shortName: "Souvik",
    role: "Software Engineer",
    headline: "Backend, platforms & AI.",
    pitch:
      "I build production systems end to end — from API design and data modeling to security, deployment, and observability. Lately: payments, government-scale SaaS, and LLM apps with RAG and agents.",
    location: "Dehradun, Uttarakhand, India",
    careerStart: "2024-01-01",
    email: "souvikhazra151@gmail.com",
    social: {
      github: "https://github.com/Mr-R-e-X",
      linkedin: "https://www.linkedin.com/in/souvik-hazra-202321252/",
      x: "https://x.com/souvik__hazra",
    },
    education: {
      degree: "B.Tech, Electrical Engineering",
      school: "Dream Institute of Technology",
      year: "2022",
    },
    photo: { fileId: null, alt: "Portrait of Souvik Hazra" },
    resume: { fileId: null, filename: "Souvik_Hazra_SDE.pdf" },
  },
  sections: {
    about: "About",
    experience: "Where I’ve worked",
    projects: "Things I’ve built",
    workProjects: "Selected production projects",
    skills: "Toolbox",
  },
  about: {
    paragraphs: [
      "Hi, I'm Souvik — a software engineer who likes owning a feature from the whiteboard to the pager. I started out teaching full-stack development at **Coding Ninjas**, where explaining other people's bugs turned out to be the best way to learn systems deeply.",
      "Since then I've built payment rails processing tens of thousands of transactions a month at **Edviron**, government-scale citizen workflows at **Prodios Labs**, and a production e-commerce platform as a freelancer — schema, APIs, security, deployment and observability included.",
      "These days I'm most excited about LLM applications that actually ship: retrieval, tool-calling agents, and the boring infrastructure that makes them reliable.",
    ],
    recentTitle: "A few technologies I've been working with lately:",
    recentTech: ["TypeScript", "NestJS", "Hono", "Next.js", "PostgreSQL", "Redis", "Docker", "Pi"],
  },
  experience: [
    {
      id: "prodios",
      company: "Prodios Labs",
      url: "https://prodioslabs.com",
      role: "Software Developer",
      period: "May 2025 — Present",
      note: "",
      points: [
        "Own UCC workflows across citizen, officer, and Super Admin journeys — making feature and workflow decisions, designing APIs, and shipping Offline Forms, clarification, document verification, and admin controls to production.",
        "Built the UCC Offline Form workflow with AES-GCM encryption for sensitive identifiers and DigiLocker integration for document verification.",
        "Redesigned the clarification workflow for officers and citizens, fixing workflow issues and making status changes easier to understand.",
        "Built Mosje, an internal data analytics tool — API design, data aggregation, visualizations, and the Super Admin workflow from day one.",
        "Shipped Tealfeed features: booking cutoffs for personal and group events, auto-notifications for recurring-event extensions, and admin-side offline payment marking.",
      ],
      stack: ["TypeScript", "NestJS", "Node.js", "React", "PostgreSQL", "MongoDB", "Redis"],
    },
    {
      id: "futuristic-pc",
      company: "Futuristic PC",
      url: "https://futuristicpc.in",
      role: "Freelance Software Developer",
      period: "Feb 2026 — Present",
      note: "",
      points: [
        "Designed the database schema and backend API for a live e-commerce platform — products, orders, payments, accounts, and admin operations.",
        "Built the PC Builder end to end with real-time component compatibility checks and live price tracking across 500+ components.",
        "Built authentication with public and private routes, an admin panel, product browsing with category, brand and spec filters, and the full checkout and order lifecycle.",
        "Deploy and run it in production with Docker on a KVM VPS, Grafana, Alloy and Loki for observability, and GitHub Actions CI/CD for lint, type-check, build and deploy.",
      ],
      stack: ["Next.js", "Node.js", "MongoDB", "Docker", "Grafana", "GitHub Actions"],
    },
    {
      id: "edviron",
      company: "Edviron",
      url: "https://www.edviron.com/",
      role: "Software Developer Intern",
      period: "Jan 2025 — Apr 2025",
      note: "",
      points: [
        "Built unified payment microservices integrating Razorpay, Cashfree, Easebuzz, PayU and HDFC — part of a system processing 60,000+ transactions a month worth ₹25–30 Cr.",
        "Implemented fault-tolerant patterns — idempotency, SQS-based async queues, exponential backoff — supporting 99.9% uptime, p95 latency under 300 ms, and payment confirmation under 2 s.",
        "Raised unit test coverage from 0.5% to 80% with Jest, cutting production incidents by 30%.",
      ],
      stack: ["TypeScript", "NestJS", "GraphQL", "MongoDB", "AWS SQS", "Jest"],
    },
    {
      id: "coding-ninjas",
      company: "Coding Ninjas",
      url: "https://www.codingninjas.com",
      role: "Fullstack Software Development TA",
      period: "Jan 2024 — Present",
      note: "Full-time in 2024 · part-time since Jan 2025",
      points: [
        "Resolved 4,000+ verified doubts across backend and full-stack development.",
        "Guide learners through debugging, architecture decisions, and code reviews on their full-stack projects.",
        "Help learners with Java and data structures & algorithms, from problem-solving approach to complexity analysis.",
      ],
      stack: ["JavaScript", "Java", "DSA", "Node.js", "Express", "MongoDB", "React"],
    },
  ],
  projects: [
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
      links: [{ id: "chatforge-live", label: "Try ChatForge", href: "https://chatforge.prodioslabs.in/" }],
    },
    {
      id: "futuristic-pc",
      title: "Futuristic PC",
      kicker: "E-commerce platform · freelance",
      badge: "",
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
      links: [{ id: "futuristic-store", label: "Visit store", href: "https://futuristicpc.in" }],
    },
  ],
  workProjects: [
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
      href: "",
    },
  ],
  skills: [
    { id: "languages", label: "Languages", items: ["JavaScript", "TypeScript", "Java", "DSA"] },
    { id: "frontend", label: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
    {
      id: "backend",
      label: "Backend",
      items: ["Node.js", "Bun", "NestJS", "Hono", "Express", "REST", "GraphQL", "tRPC"],
    },
    { id: "data", label: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "Typesense"] },
    { id: "infra", label: "Infra", items: ["Docker", "AWS", "CI/CD", "Grafana", "Loki"] },
    { id: "ai", label: "AI", items: ["LLMs", "RAG", "AI Agents", "Vercel AI SDK", "pgvector"] },
  ],
  contact: {
    kicker: "What’s next?",
    title: "Let’s build something.",
    body: "I'm open to full-time roles and interesting freelance work — backend, platform, or AI-heavy. My inbox is always open, whether it's an opportunity or just a hello.",
  },
  footer: { text: "Designed & built by Souvik Hazra." },
};
