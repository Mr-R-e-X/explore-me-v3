import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="flex flex-col gap-2 border-t border-line py-8 font-mono text-xs text-muted">
      <p>Designed &amp; built by {profile.name}.</p>
    </footer>
  );
}
