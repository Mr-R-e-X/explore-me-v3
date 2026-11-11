import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { getContent } from "@/lib/content/get-content";
import { siteUrl } from "@/lib/content/helpers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContent();
  const { profile, seo } = content;
  const [firstName, ...rest] = profile.name.split(" ");
  const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() || undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.title, template: `%s · ${profile.name}` },
    description: seo.description,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    keywords: seo.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      url: "/",
      siteName: profile.name,
      title: seo.title,
      description: seo.description,
      locale: "en_IN",
      firstName,
      lastName: rest.join(" ") || undefined,
      username: handle(profile.social.github),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      creator: profile.social.x ? `@${handle(profile.social.x)}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d17" },
  ],
};

// Runs before first paint so the saved / system theme never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <a
          href="#content"
          className="sr-only z-50 bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
        {/* The insights script only exists on Vercel deployments; elsewhere it 404s. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
