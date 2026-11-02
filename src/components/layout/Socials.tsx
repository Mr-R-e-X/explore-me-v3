import { Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/Icons";

const links = [
  { href: profile.social.github, label: "GitHub", Icon: GitHubIcon },
  { href: profile.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: profile.social.x, label: "X (Twitter)", Icon: XIcon },
  { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
];

export function Socials({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`} aria-label="Social links">
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer me" : undefined}
            className="inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-accent-ink"
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
