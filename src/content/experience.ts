export type Job = {
  id: string;
  company: string;
  url?: string;
  role: string;
  period: string;
  note?: string;
  points: string[];
  stack: string[];
};

export const experience: Job[] = [
  {
    id: "prodios",
    company: "Prodios Labs",
    url: "https://prodioslabs.com",
    role: "Software Developer",
    period: "May 2025 — Present",
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
];
