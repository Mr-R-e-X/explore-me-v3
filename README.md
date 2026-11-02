# exploresouvik.in

Personal portfolio — Next.js 16 (App Router, Cache Components), Tailwind CSS v4, MongoDB-backed content with an `/admin` editor.

## Content & admin

All page content (profile, about, experience, projects, skills, contact, SEO, photo and resume) lives in MongoDB and is edited at **`/admin`**.

- **Save draft** stores changes without touching the live site.
- **Preview** opens the site with the draft applied (a bar at the top lets you exit).
- **Publish** makes the draft live immediately and records a version in **History**, where any of the last 50 versions can be restored into the draft.
- Lists (experience, projects, skills, bullet points, tags) are reordered by dragging the handle.
- In About paragraphs, wrap words in `**double asterisks**` to highlight them.

The public page stays statically cached; publishing invalidates that cache. Without `MONGODB_URI` the site renders the built-in defaults from `src/lib/content/defaults.ts` and the admin is disabled.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm hash-password        # paste the printed ADMIN_PASSWORD_HASH into .env.local
openssl rand -base64 48   # use as SESSION_SECRET
pnpm seed                 # first run only: copies the defaults, photo and resume into MongoDB
pnpm dev
```

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name (default `portfolio`) |
| `ADMIN_PASSWORD_HASH` | scrypt hash from `pnpm hash-password` |
| `SESSION_SECRET` | 32+ random characters used to sign the admin session |

## Deploying (Vercel)

1. Add the four variables above in the Vercel project settings (Production and Preview).
2. Run `pnpm seed` once against the production database (`MONGODB_URI=… pnpm seed`).
3. Deploy. Content edits after that need no redeploy — publish from `/admin`.
