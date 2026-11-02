export const skillGroups = [
  { label: "Languages", items: ["JavaScript", "TypeScript", "Java", "DSA"] },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  {
    label: "Backend",
    items: ["Node.js", "Bun", "NestJS", "Hono", "Express", "REST", "GraphQL", "tRPC"],
  },
  { label: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "Typesense"] },
  { label: "Infra", items: ["Docker", "AWS", "CI/CD", "Grafana", "Loki"] },
  { label: "AI", items: ["LLMs", "RAG", "AI Agents", "Vercel AI SDK", "pgvector"] },
] as const;
