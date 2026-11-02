import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const grid = "rgba(15,18,34,0.06)";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#fafaf7",
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          color: "#0f1222",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#5b6070" }}>
          <span>PORTFOLIO · FIG. 00</span>
          <span>EXPLORESOUVIK.IN</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ fontSize: 44, marginTop: 12, display: "flex" }}>
            {profile.role}.&nbsp;<span style={{ color: "#5b4cf0" }}>{profile.headline}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#4f3fe0" }}>
          {["TypeScript", "Node.js", "NestJS", "Next.js", "PostgreSQL", "RAG / Agents"].map((t) => (
            <span
              key={t}
              style={{ padding: "8px 18px", border: "1px solid #cfd0da", borderRadius: 999, background: "#eeebff" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
